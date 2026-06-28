import re
import json
import os

def parse_md_file(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    questions = []
    
    # 分割每个题目（以 **数字. 开头）
    question_blocks = re.split(r'\n(?=\*\*)', content)
    
    for block in question_blocks:
        # 匹配题目编号和内容
        q_match = re.search(r'\*\*(\d+)\.\s+(.+?)\*\*', block, re.DOTALL)
        if not q_match:
            continue
        
        q_num = int(q_match.group(1))
        q_text = q_match.group(2).strip()
        
        # 匹配答案
        ans_match = re.search(r'\*\*正确答案[：:]\s*([A-Z]+)\*\*', block)
        if not ans_match:
            continue
        
        answer_str = ans_match.group(1).strip()
        
        # 提取选项
        options = []
        opt_matches = re.findall(r'\*\s*([A-Z])\s*[、．.,、]\s*(.+?)(?=\n\*\s*[A-Z]|$)', block, re.DOTALL)
        
        for opt_label, opt_text in opt_matches:
            opt_text = opt_text.strip()
            # 清理格式
            opt_text = re.sub(r'\*+', '', opt_text).strip()
            # 移除答案标注
            opt_text = re.sub(r'\*\*正确答案.*', '', opt_text).strip()
            if opt_text:
                options.append(opt_text)
        
        if len(options) < 4:
            continue
        
        # 处理答案
        answer_indices = [ord(c) - ord('A') for c in answer_str]
        max_idx = max(answer_indices)
        if max_idx >= len(options):
            continue
        
        q_type = 'multiple' if len(answer_indices) > 1 else 'single'
        
        questions.append({
            'type': q_type,
            'question': q_text,
            'options': options,
            'answer': answer_indices,
            'explanation': ''
        })
    
    return questions

def main():
    base_dir = r'C:\Users\不知道叫什么\Desktop\学习\大三下\毛概习概\复习\第二套试题\选择题szx'
    
    all_questions = []
    
    files = [
        '习思想选择题_1-50.md',
        '习思想选择题_51-100.md',
        '习思想选择题_101-156.md',
        '习思想选择题_多选题_1-76.md'
    ]
    
    total_single = 0
    total_multi = 0
    
    for fname in files:
        fpath = os.path.join(base_dir, fname)
        if os.path.exists(fpath):
            qs = parse_md_file(fpath)
            single = [q for q in qs if q['type'] == 'single']
            multi = [q for q in qs if q['type'] == 'multiple']
            total_single += len(single)
            total_multi += len(multi)
            all_questions.extend(qs)
            print(f'{fname}: 提取 {len(qs)} 道 (单选{len(single)}, 多选{len(multi)})')
    
    print(f'\n总计提取: {len(all_questions)} 道')
    print(f'  单选题: {total_single} 道')
    print(f'  多选题: {total_multi} 道')
    
    # 质量检查
    bad = 0
    for q in all_questions:
        q_text = q['question']
        has_option = any(chr(65+j)+'．' in q_text or chr(65+j)+'.' in q_text for j in range(8))
        if has_option:
            bad += 1
    print(f'  题目含选项标签: {bad} 道')
    
    result = []
    for q in all_questions:
        result.append({
            'type': q['type'],
            'question': q['question'],
            'options': q['options'],
            'answer': q['answer'],
            'explanation': q.get('explanation', '')
        })
    
    output_path = r'c:\Users\不知道叫什么\Desktop\学习\大三下\毛概习概\复习\试题与解析\questions_second_new.json'
    with open(output_path, 'w', encoding='utf-8') as f:
        json.dump(result, f, ensure_ascii=False, indent=2)
    
    print(f'\n已保存到: {output_path}')
    
    print('\n=== 前5道题预览 ===')
    for i, q in enumerate(result[:5]):
        ans = ''.join([chr(65+a) for a in q['answer']])
        print(f'  [{q["type"]}] 第{i+1}题: {q["question"][:40]}... 答案:{ans}')

if __name__ == '__main__':
    main()
