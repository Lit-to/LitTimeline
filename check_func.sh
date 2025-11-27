#!/bin/bash

# 使い方: ./check_func path/to/folder
TARGET_DIR="$1"

# "static" を含む行を検索しつつ、@static を除外
grep -RIn --include="*.ts" --exclude-dir=node_modules "static" "$TARGET_DIR" \
  | grep -v "@static" \
  | while IFS=: read -r file line content; do
    # 1行目ならスキップ
    if (( line <= 1 )); then
        continue
    fi

    prev_line=$(sed -n "$((line-1))p" "$file")

    if [[ "$prev_line" != */ ]]; then
        echo "⚠️ $file:$line → 前の行が '*/' ではありません"
        echo "  前行: $prev_line"
        echo "  該当: $content"
        echo
    fi
done
