import json
import re

def clean_question(q, next_q_text=None):
    options = q['options']
    answer = q['answer']
    q_type = q['type']
    
    expected_options = 4
    
    if len(options) <= expected_options:
        if len(options) < 2:
            return None
        return q
    
    cleaned_options = []
    max_answer_index = max(answer) if answer else 0
    
    if max_answer_index < expected_options and len(options) >= expected_options:
        cleaned_options = options[:expected_options]
    else:
        cleaned_options = options[:expected_options]
    
    if len(cleaned_options) < 2:
        return None
    
    q['options'] = cleaned_options
    
    valid_answers = [a for a in answer if a < len(cleaned_options)]
    if not valid_answers:
        return None
    q['answer'] = valid_answers
    
    return q

def main():
    with open('questions.json', 'r', encoding='utf-8') as f:
        questions = json.load(f)
    
    print(f'原始题目数: {len(questions)}')
    
    cleaned = []
    for i, q in enumerate(questions):
        result = clean_question(q)
        if result:
            cleaned.append(result)
    
    print(f'清理后题目数: {len(cleaned)}')
    
    from collections import Counter
    opt_counts = Counter(len(q['options']) for q in cleaned)
    print('\\n选项数量分布:')
    for c in sorted(opt_counts.keys()):
        print(f'  {c}个选项: {opt_counts[c]}道题')
    
    type_counts = Counter(q['type'] for q in cleaned)
    print('\\n题型分布:')
    for t, c in type_counts.items():
        print(f'  {t}: {c}道题')
    
    with open('questions_cleaned.json', 'w', encoding='utf-8') as f:
        json.dump(cleaned, f, ensure_ascii=False, indent=2)
    
    print('\\n已保存到 questions_cleaned.json')
    
    print('\\n===== 前5题预览 =====')
    for i, q in enumerate(cleaned[:5]):
        ans = ''.join(chr(65+a) for a in q['answer'])
        print(f'\\n第{i+1}题 ({q["type"]}, 答案: {ans}):')
        print(f'  {q["question"][:60]}...')
        for j, opt in enumerate(q['options']):
            print(f'  {chr(65+j)}. {opt[:50]}' + ('...' if len(opt)>50 else ''))

if __name__ == '__main__':
    main()
