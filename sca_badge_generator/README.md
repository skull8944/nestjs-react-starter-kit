# SCA Badge Generator

此程式可以讀取指定的 JSON 檔案，並根據其中的 SCA 風險等級資料，產生對應的 Badge SVG 檔案。

## 使用方式

### 安裝

本程式需要 Python 3.6 以上的版本以及 `anybadge` 套件才能執行。您可以透過以下指令安裝：

```bash
pip install -r requirements.txt
```

### 執行

您可以透過以下指令執行本程式：

```bash
python sca_badge_generator.py [JSON檔案路徑] [最小風險等級（預設為9）]
```

例如：

```bash
python sca_badge_generator.py sca_data.json 8
```

程式將讀取 `sca_data.json` 檔案，並產生 SCA L10 ~ L8 的 Badge SVG 檔案。

### Docker

您也可以透過 Docker 容器來執行本程式。您可以先使用以下指令建立 Docker image：

```bash
docker build -t sca-badge-generator .
```

接著，您可以透過以下指令執行 Docker 容器：

```bash
docker run --rm -v "$(pwd)":/app sca-badge-generator [JSON檔案路徑] [最小產生等級（預設為9）]
```

例如：

```bash
docker run --rm -v "$(pwd)":/app sca-badge-generator sca_data.json 8
```

程式將讀取 `sca_data.json` 檔案，並產生 SCA L10 ~ L8 的 Badge SVG 檔案。其中 `-v "$(pwd)":/app` 參數是將當前目錄掛載到 Docker 容器中的 `/app` 目錄，讓程式可以讀取到指定的 JSON 檔案。