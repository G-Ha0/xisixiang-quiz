import fitz
from rapidocr_onnxruntime import RapidOCR
import numpy as np
import json
import re

def extract_text_from_pdf(pdf_path, dpi=200):
    ocr = RapidOCR()
    doc = fitz.open(pdf_path)
    all_pages_text = []
    
    print(f'正在处理 {pdf_path}，共 {len(doc)} 页...')
    
    for page_num in range(len(doc)):
        page = doc[page_num]
        pix = page.get_pixmap(dpi=dpi)
        img = np.frombuffer(pix.samples, dtype=np.uint8).reshape(pix.height, pix.width, pix.n)
        
        result, _ = ocr(img)
        
        if result:
            lines = []
            for item in result:
                lines.append(item[1])
            all_pages_text.append({
                'page': page_num + 1,
                'lines': lines
            })
            print(f'  第 {page_num + 1} 页: 识别到 {len(lines)} 行')
        else:
            print(f'  第 {page_num + 1} 页: 无内容')
    
    return all_pages_text

def parse_questions(pages_text):
    questions = []
    current_question = None
    current_option = None
    all_text_lines = []
    
    for page in pages_text:
        all_text_lines.extend(page['lines'])
    
    full_text = '\n'.join(all_text_lines)
    print(f'\n总文本行数: {len(all_text_lines)}')
    
    i = 0
    in_question = False
    
    while i < len(all_text_lines):
        line = all_text_lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        q_match = re.match(r'^(\d+)[\.、](.*)', line)
        
        if q_match and not re.match(r'^[A-D][\.、]', line):
            q_num = int(q_match.group(1))
            q_text = q_match.group(2).strip()
            
            if 1 <= q_num <= 200 and len(q_text) > 5:
                if current_question:
                    questions.append(current_question)
                
                current_question = {
                    'number': q_num,
                    'question': q_text,
                    'options': [],
                    'type': 'single'
                }
                in_question = True
                i += 1
                continue
        
        opt_match = re.match(r'^([A-D])[\.、](.*)', line)
        if opt_match and current_question:
            opt_label = opt_match.group(1)
            opt_text = opt_match.group(2).strip()
            
            full_opt_text = opt_text
            i += 1
            while i < len(all_text_lines):
                next_line = all_text_lines[i].strip()
                if next_line and not re.match(r'^[A-D][\.、]', next_line) and not re.match(r'^\d+[\.、]', next_line):
                    if len(next_line) > 2 and not re.match(r'^(第|一、|二、|三、|四、|单项|多项|导论|第.)', next_line):
                        full_opt_text += next_line
                        i += 1
                        continue
                break
            
            current_question['options'].append(full_opt_text)
            
            if i < len(all_text_lines):
                continue
            else:
                break
        
        if in_question and current_question and not opt_match and not q_match:
            if len(line) > 3 and not re.match(r'^(第|一、|二、|三、|四、|单项|多项|导论|第.)', line):
                if len(current_question['options']) == 0:
                    current_question['question'] += line
                elif len(current_question['options']) > 0:
                    current_question['options'][-1] += line
        
        i += 1
    
    if current_question:
        questions.append(current_question)
    
    return questions

def main():
    print('=' * 60)
    print('正在提取试题PDF...')
    question_pages = extract_text_from_pdf('27徐涛《优题库-试题基础篇》_60-95.pdf')
    
    print('\n' + '=' * 60)
    print('正在解析题目...')
    questions = parse_questions(question_pages)
    
    print(f'\n共解析到 {len(questions)} 道题目')
    
    result = []
    for q in questions:
        if len(q['options']) >= 2 and len(q['question']) > 5:
            result.append({
                'type': 'single',
                'question': q['question'],
                'options': q['options'],
                'answer': [],
                'explanation': ''
            })
    
    print(f'有效题目: {len(result)} 道')
    
    with open('extracted_questions.json', 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print('\n题目已保存到 extracted_questions.json')
    
    print('\n' + '=' * 60)
    print('正在提取解析PDF...')
    answer_pages = extract_text_from_pdf('27徐涛《优题库-解析基础篇》_63-95.pdf')
    
    all_answer_text = []
    for page in answer_pages:
        all_answer_text.extend(page['lines'])
    
    with open('extracted_answers_raw.txt', 'w', encoding='utf-8') as f:
        f.write('\n'.join(all_answer_text))
    
    print(f'\n解析文本已保存到 extracted_answers_raw.txt，共 {len(all_answer_text)} 行')

if __name__ == '__main__':
    main()
