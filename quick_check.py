import json

qs = json.load(open('questions.json', encoding='utf-8'))
print(f'总题数: {len(qs)}')

bad = 0
for q in qs:
    for j in range(8):
        if chr(65+j)+'．' in q['question']:
            bad += 1
            break

print(f'题目含选项标签: {bad}')
print(f'单选: {sum(1 for q in qs if q["type"]=="single")}')
print(f'多选: {sum(1 for q in qs if q["type"]=="multiple")}')
print(f'判断: {sum(1 for q in qs if q["type"]=="judge")}')
