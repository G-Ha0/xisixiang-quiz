import fitz
from rapidocr_onnxruntime import RapidOCR
import numpy as np
import json
import re

def extract_text_from_pdf(pdf_path, dpi=200):
    ocr = RapidOCR()
    doc = fitz.open(pdf_path)
    all_pages = []
    
    print(f'正在处理 {pdf_path}，共 {len(doc)} 页...')
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(dpi=dpi)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        
        result, _ = ocr(img)
        
        if result:
            lines = [item[1] for item in result]
            all_pages.append({
                'page': page_num + 1,
                'lines': lines
            })
    
    return all_pages

def detect_chapters(pages_text):
    chapters = []
    current_chapter = None
    
    all_lines = []
    for page in pages_text:
        all_lines.extend(page['lines'])
    
    for line in all_lines:
        line = line.strip()
        
        m = re.match(r'^(第[一二三四五六七八九十]+章[^\n]*)', line)
        if m:
            chapter_name = m.group(1).strip()
            current_chapter = {'name': chapter_name, 'lines': []}
            chapters.append(current_chapter)
            continue
        
        if line == '导论' and current_chapter is None:
            current_chapter = {'name': '导论', 'lines': []}
            chapters.append(current_chapter)
            continue
        
        if current_chapter:
            current_chapter['lines'].append(line)
    
    return chapters

def parse_questions_from_chapter(chapter_lines):
    questions = []
    current_q = None
    current_opt_text = ''
    collecting_opt = False
    
    i = 0
    while i < len(chapter_lines):
        line = chapter_lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        q_match = re.match(r'^(\d+)[\.、](.*)', line)
        if q_match and not re.match(r'^[A-D][\.、]', line):
            q_num = int(q_match.group(1))
            q_text = q_match.group(2).strip()
            
            if q_num <= 50 and len(q_text) > 2:
                if current_q:
                    if collecting_opt and current_opt_text:
                        current_q['options'].append(current_opt_text.strip())
                    questions.append(current_q)
                
                current_q = {
                    'number': q_num,
                    'question': q_text,
                    'options': [],
                    'type': 'single'
                }
                collecting_opt = False
                current_opt_text = ''
                i += 1
                continue
        
        opt_match = re.match(r'^([A-D])[\.、](.*)', line)
        if opt_match and current_q:
            if collecting_opt and current_opt_text:
                current_q['options'].append(current_opt_text.strip())
            
            opt_text = opt_match.group(2).strip()
            current_opt_text = opt_text
            collecting_opt = True
            i += 1
            continue
        
        if current_q:
            is_chapter_title = bool(re.match(r'^第[一二三四五六七八九十]+章', line))
            is_section = bool(re.match(r'^(一、|二、|三、|四、|单项|多项|导论|答案|考研|基础题|手最快|第三部分|0\d{2,3})', line))
            
            if is_chapter_title or is_section:
                i += 1
                continue
            
            if len(current_q['options']) == 0 and not collecting_opt:
                if len(line) > 2:
                    current_q['question'] += line
            elif collecting_opt:
                if len(line) > 1 and len(line) < 100:
                    current_opt_text += line
        
        i += 1
    
    if current_q:
        if collecting_opt and current_opt_text:
            current_q['options'].append(current_opt_text.strip())
        questions.append(current_q)
    
    return questions

def parse_answers_from_chapter(chapter_lines):
    answers = {}
    current_q = None
    current_explanation = []
    in_answer_section = False
    
    for line in chapter_lines:
        line = line.strip()
        
        if not line:
            continue
        
        if '答案解析' in line:
            in_answer_section = True
            continue
        
        if '答案速查' in line:
            in_answer_section = False
            if current_q is not None and current_explanation:
                answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
            current_q = None
            continue
        
        if not in_answer_section:
            continue
        
        ans_match = None
        patterns = [
            r'^(\d+)\.([A-D]{1,4})(.*)',
            r'^(\d+)\.\s+([A-D]{1,4})(.*)',
            r'^(\d+)\s+([A-D]{1,4})\s*(.*)',
            r'^(\d+)[\.、]\s*([A-D]{1,4})\s*(.*)',
        ]
        
        for pat in patterns:
            m = re.match(pat, line)
            if m:
                ans_match = m
                break
        
        if ans_match:
            q_num = int(ans_match.group(1))
            ans_letter = ans_match.group(2).upper()
            rest = ans_match.group(3).strip() if len(ans_match.groups()) >= 3 else ''
            
            if 1 <= q_num <= 50:
                if current_q is not None and current_explanation:
                    answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
                
                current_q = q_num
                ans_indices = [ord(c) - ord('A') for c in ans_letter]
                answers[current_q] = {
                    'answer': ans_indices,
                    'explanation': ''
                }
                current_explanation = []
                if rest and len(rest) > 2:
                    current_explanation.append(rest)
                continue
        
        if current_q is not None:
            skip_patterns = [
                r'^答案速查',
                r'^题号',
                r'^答案$',
                r'^答案解析',
                r'^第[一二三四五六七八九十]+章',
                r'^导论',
                r'^第.+篇',
                r'^0\d{2,3}$',
                r'^考研政治',
                r'^基础题篇',
                r'^手最快',
                r'^第三部分',
                r'^识记点',
                r'^O识记点',
                r'^—*$',
            ]
            
            skip = False
            for pat in skip_patterns:
                if re.match(pat, line):
                    skip = True
                    break
            
            if not skip and len(line) > 1:
                current_explanation.append(line)
    
    if current_q is not None and current_explanation:
        answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
    
    return answers

def main():
    print('=' * 60)
    print('第一步：提取试题PDF...')
    question_pages = extract_text_from_pdf('27徐涛《优题库-试题基础篇》_60-95.pdf')
    
    print('\\n检测章节...')
    question_chapters = detect_chapters(question_pages)
    print(f'找到 {len(question_chapters)} 个章节')
    for ch in question_chapters:
        print(f'  {ch["name"]}: {len(ch["lines"])} 行')
    
    all_questions = []
    for ch in question_chapters:
        qs = parse_questions_from_chapter(ch['lines'])
        valid_qs = [q for q in qs if len(q['options']) >= 2]
        print(f'  {ch["name"]}: {len(valid_qs)} 道有效题')
        all_questions.extend(valid_qs)
    
    print(f'\\n总计: {len(all_questions)} 道题目')
    
    print('\\n' + '=' * 60)
    print('第二步：提取解析PDF...')
    answer_pages = extract_text_from_pdf('27徐涛《优题库-解析基础篇》_63-95.pdf')
    
    print('\\n检测章节...')
    answer_chapters = detect_chapters(answer_pages)
    print(f'找到 {len(answer_chapters)} 个章节')
    
    all_answers = {}
    global_q_num = 0
    
    for qi, ch in enumerate(question_chapters):
        qs = parse_questions_from_chapter(ch['lines'])
        valid_qs = [q for q in qs if len(q['options']) >= 2]
        
        chapter_answers = {}
        if qi < len(answer_chapters):
            chapter_answers = parse_answers_from_chapter(answer_chapters[qi]['lines'])
        
        matched = 0
        for q in valid_qs:
            global_q_num += 1
            q_num = q['number']
            
            result_q = {
                'type': 'single',
                'question': q['question'],
                'options': q['options'],
                'answer': [],
                'explanation': ''
            }
            
            if q_num in chapter_answers:
                result_q['answer'] = chapter_answers[q_num]['answer']
                result_q['explanation'] = chapter_answers[q_num]['explanation']
                if len(result_q['answer']) > 1:
                    result_q['type'] = 'multiple'
                matched += 1
            
            all_answers[global_q_num] = result_q
        
        print(f'  {ch["name"]}: {len(valid_qs)}题, 匹配{matched}题答案')
    
    valid_questions = [q for q in all_answers.values() if q.get('answer') and len(q['answer']) > 0]
    print(f'\\n总有效题目（有答案）: {len(valid_questions)} 道')
    
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(valid_questions, f, ensure_ascii=False, indent=2)
    
    print('\\n题目已保存到 questions.json')
    
    single_count = sum(1 for q in valid_questions if q['type'] == 'single')
    multi_count = sum(1 for q in valid_questions if q['type'] == 'multiple')
    print(f'  单选题: {single_count} 道')
    print(f'  多选题: {multi_count} 道')
    
    print('\\n前5道题预览：')
    for i, q in enumerate(valid_questions[:5]):
        ans = ''.join([chr(65+a) for a in q['answer']])
        print(f'  {i+1}. {q["question"][:40]}... 答案:{ans} 选项数:{len(q["options"])}')

if __name__ == '__main__':
    main()
