import json

# 读取新题目
with open('questions_second_new.json', encoding='utf-8') as f:
    new_questions = json.load(f)

# 读取现有题库
with open('questions.json', encoding='utf-8') as f:
    existing_questions = json.load(f)

print(f'新题目: {len(new_questions)} 道')
print(f'  单选: {sum(1 for q in new_questions if q["type"] == "single")}')
print(f'  多选: {sum(1 for q in new_questions if q["type"] == "multiple")}')
print(f'  判断: {sum(1 for q in new_questions if q["type"] == "judge")}')

print(f'\n现有题库: {len(existing_questions)} 道')
print(f'  单选: {sum(1 for q in existing_questions if q["type"] == "single")}')
print(f'  多选: {sum(1 for q in existing_questions if q["type"] == "multiple")}')
print(f'  判断: {sum(1 for q in existing_questions if q["type"] == "judge")}')

# 只保留判断题
judge_only = [q for q in existing_questions if q['type'] == 'judge']
print(f'\n保留判断题: {len(judge_only)} 道')

# 合并
combined = judge_only + new_questions
print(f'合并后: {len(combined)} 道')

# 去重（按题目内容前50字符）
seen = set()
unique = []
for q in combined:
    key = q['question'][:50]
    if key not in seen:
        seen.add(key)
        unique.append(q)

print(f'去重后: {len(unique)} 道')

# 统计
print(f'\n最终统计:')
print(f'  单选: {sum(1 for q in unique if q["type"] == "single")}')
print(f'  多选: {sum(1 for q in unique if q["type"] == "multiple")}')
print(f'  判断: {sum(1 for q in unique if q["type"] == "judge")}')
print(f'  总计: {len(unique)}')

# 保存
with open('questions.json', 'w', encoding='utf-8') as f:
    json.dump(unique, f, ensure_ascii=False, indent=2)

print('\n已保存到 questions.json')
