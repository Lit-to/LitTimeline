#!/bin/bash

# 使い方: ./check_param_missing_desc.sh path/to/dir
TARGET_DIR="$1"

# node_modules を除外し、@param があるが "-" が後にない行を抽出
grep -RIn --include="*.ts" --exclude-dir=node_modules "@param" "$TARGET_DIR" \
  | grep -vE "@param[[:space:]]+[^-]*-[[:space:]]"
