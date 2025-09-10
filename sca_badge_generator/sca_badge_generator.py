import os
import sys
import json
import typing
import anybadge


def try_parse_int(text: str, default: int = 0):
    """
    嘗試將文字轉換為整數，若轉換失敗則回傳預設值。
    """
    try:
        return int(text)
    except ValueError:
        return default


def try_delete(filename: str):
    os.remove(filename) if os.path.exists(filename) else None


def generate_badges(json_filename: str, gen_level: int):
    """
    根據指定的 JSON 檔案和生成級別，生成 SCA 級別徽章 SVG 檔案。
    """
    # 讀取 JSON 檔案
    try:
        with open(json_filename, "r") as f:
            json_data = f.read()
    except FileNotFoundError:
        print(f"File not found: {json_filename}")
        return

    # 解析 JSON 資料
    try:
        data = json.loads(json_data)
    except json.JSONDecodeError as e:
        print(f"Error parsing JSON: {e}")
        return

    # 對 alerts 中的 threatLevel 進行統計
    count_dict: typing.Dict[int, int] = {}
    for alert in data.get("policyEvaluationResult", {}).get("alerts", []):
        threat_level = alert.get("trigger", {}).get("threatLevel")
        if threat_level in count_dict:
            count_dict[threat_level] += 1
        else:
            count_dict[threat_level] = 1

    # 透過 anybadge 產生 SVG 檔案
    for threat_level in range(10, gen_level - 1, -1):
        count = count_dict.get(threat_level, 0)
        label = f"SCA L{threat_level}"
        color = "green" if count == 0 else "red"
        badgeFileName = f"sca_level_badge_{threat_level}.svg"

        try_delete(badgeFileName)

        badge = anybadge.Badge(label, value=count, default_color=color)
        badge.write_badge(badgeFileName)

        print(f"Badge sca_level_badge_{threat_level}.svg generated")


if __name__ == "__main__":
    # 檢查輸入參數是否正確
    if len(sys.argv) < 2:
        print("Argument missing")
        sys.exit(1)

    json_filename = sys.argv[1]

    gen_level = try_parse_int(sys.argv[2], 9) if len(sys.argv) > 2 else 9

    generate_badges(json_filename, gen_level)
