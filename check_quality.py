import json
from collections import Counter

with open('questions.json', 'r', encoding='utf-8') as f:
    qs = json.load(f)

print('选项数量分布:')
opt_counts = Counter(len(q['options']) for q in qs)
for c in sorted(opt_counts.keys()):
    print(f'  {c}个选项: {opt_counts[c]}道题')

print()
print('题型分布:')
type_counts = Counter(q['type'] for q in qs)
for t, c in type_counts.items():
    print(f'  {t}: {c}道题')

print()
print('题目长度分布:')
q_lens = [len(q['question']) for q in qs]
print(f'  最短: {min(q_lens)} 字')
print(f'  最长: {max(q_lens)} 字')
print(f'  平均: {sum(q_lens)//len(q_lens)} 字')

print()
print('解析长度分布:')
e_lens = [len(q['explanation']) for q in qs]
print(f'  最短: {min(e_lens)} 字')
print(f'  最长: {max(e_lens)} 字')
print(f'  平均: {sum(e_lens)//len(e_lens)} 字')

print()
print('===== 前3题详情 =====')
for i, q in enumerate(qs[:3]):
    ans_letters = ''.join(chr(65+a) for a in q['answer'])
    print(f'\n第{i+1}题 ({q["type"]}, 答案: {ans_letters}):')
    print(f'  题目: {q["question"][:80]}...')
    print(f'  选项数: {len(q["options"])}')
    for j, opt in enumerate(q['options']):
        preview = opt[:60] + '...' if len(opt) > 60 else opt
        print(f'    {chr(65+j)}. {preview}')

print()
print('===== 选项数>4的题 =====')
bad_count = 0
for i, q in enumerate(qs):
    if len(q['options']) > 6:
        bad_count += 1
        if bad_count <= 5:
            ans_letters = ''.join(chr(65+a) for a in q['answer'])
            print(f'\n第{i+1}题 ({len(q["options"])}个选项, 答案: {ans_letters}):')
            print(f'  题目: {q["question"][:60]}...')
            for j, opt in enumerate(q['options'][:8]):
                preview = opt[:40] + '...' if len(opt) > 40 else opt
                print(f'    {chr(65+j)}. {preview}')
