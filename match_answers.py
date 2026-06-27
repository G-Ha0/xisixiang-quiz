import json
import re

def parse_answers_from_text(text_file):
    with open(text_file, 'r', encoding='utf-8') as f:
        lines = f.readlines()
    
    answers = {}
    current_q = None
    current_explanation = []
    
    i = 0
    in_answer_section = False
    
    while i < len(lines):
        line = lines[i].strip()
        
        if not line:
            i += 1
            continue
        
        if '答案解析' in line:
            in_answer_section = True
            i += 1
            continue
        
        if '答案速查' in line:
            in_answer_section = False
            if current_q is not None and current_explanation:
                answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
            current_q = None
            i += 1
            continue
        
        if not in_answer_section:
            i += 1
            continue
        
        m = re.match(r'^(\d+)\.?\s*([A-D]{1,4})\s*$', line)
        if not m:
            m = re.match(r'^(\d+)\.([A-D]{1,4})(.*)', line)
        if not m:
            m = re.match(r'^(\d+)[\.、]\s*([A-D]{1,4})(.*)', line)
        
        if m:
            q_num = int(m.group(1))
            ans_letter = m.group(2).upper()
            rest = m.group(3).strip() if len(m.groups()) > 2 else ''
            
            if 1 <= q_num <= 200:
                if current_q is not None and current_explanation:
                    answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
                
                current_q = q_num
                ans_indices = [ord(c) - ord('A') for c in ans_letter]
                answers[current_q] = {
                    'answer': ans_indices,
                    'explanation': ''
                }
                current_explanation = []
                if rest and len(rest) > 1 and not re.match(r'^[一二三四五六七八九十]+', rest):
                    current_explanation.append(rest)
                i += 1
                continue
        
        m2 = re.match(r'^(\d+)\s+([A-D]{1,4})\s*$', line)
        if m2 and current_q is None:
            q_num = int(m2.group(1))
            ans_letter = m2.group(2).upper()
            if 1 <= q_num <= 200:
                if current_q is not None and current_explanation:
                    answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
                current_q = q_num
                ans_indices = [ord(c) - ord('A') for c in ans_letter]
                answers[current_q] = {
                    'answer': ans_indices,
                    'explanation': ''
                }
                current_explanation = []
                i += 1
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
                r'^\d+答案$',
            ]
            
            skip = False
            for pat in skip_patterns:
                if re.match(pat, line):
                    skip = True
                    break
            
            if not skip and len(line) > 1:
                current_explanation.append(line)
        
        i += 1
    
    if current_q is not None and current_explanation:
        answers[current_q]['explanation'] = '\n'.join(current_explanation).strip()
    
    return answers

def main():
    answers = parse_answers_from_text('extracted_answers_raw.txt')
    
    print(f'共解析到 {len(answers)} 道题的答案')
    
    for q_num in sorted(answers.keys())[:15]:
        a = answers[q_num]
        ans_letters = ''.join([chr(65 + i) for i in a['answer']])
        exp_preview = a['explanation'][:40].replace('\n', ' ')
        print(f'  第{q_num}题: 答案={ans_letters}, 解析={exp_preview}...')
    
    print(f'\\n题号范围: {min(answers.keys())} - {max(answers.keys())}')
    
    with open('extracted_questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f'\\n题目数量: {len(questions)}')
    
    matched = 0
    for i, q in enumerate(questions):
        q_num = i + 1
        if q_num in answers:
            q['answer'] = answers[q_num]['answer']
            q['explanation'] = answers[q_num]['explanation']
            
            if len(q['answer']) > 1:
                q['type'] = 'multiple'
            else:
                q['type'] = 'single'
            matched += 1
    
    print(f'成功匹配 {matched} 道题')
    
    valid_questions = [q for q in questions if q.get('answer') and len(q['answer']) > 0]
    print(f'有答案的题目: {len(valid_questions)} 道')
    
    with open('questions.json', 'w', encoding='utf-8') as f:
        json.dump(valid_questions, f, ensure_ascii=False, indent=2)
    
    print('\\n最终题目已保存到 questions.json')
    
    single_count = sum(1 for q in valid_questions if q['type'] == 'single')
    multi_count = sum(1 for q in valid_questions if q['type'] == 'multiple')
    print(f'  单选题: {single_count} 道')
    print(f'  多选题: {multi_count} 道')

if __name__ == '__main__':
    main()
