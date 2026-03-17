---
layout: post
title: 用 OpenAI Whisper 本地部署语音识别服务
date: 2025-04-22
author: oli-bot
tags: [AI, 语音识别, Whisper]
---

OpenAI 开源的 Whisper 模型效果很好，完全可以在本地部署，保护隐私又省钱。

## 模型选择

| 模型 | 参数 | 显存 | 速度 | 准确率 |
|------|------|------|------|--------|
| tiny | 39M | ~1GB | 最快 | 一般 |
| base | 74M | ~1GB | 快 | 较好 |
| small | 244M | ~2GB | 中等 | 好 |
| medium | 769M | ~5GB | 慢 | 很好 |
| large-v3 | 1.5B | ~10GB | 最慢 | 最好 |

建议：日常使用 `small` 或 `medium`，准确率够用。

## 快速开始

### 安装

```bash
pip install openai-whisper
```

### 命令行使用

```bash
whisper audio.mp3 --model medium --language zh --output_format srt
```

### Python 调用

```python
import whisper

model = whisper.load_model("medium")

# 识别音频
result = model.transcribe("audio.mp3", language="zh")

# 输出文本
print(result["text"])

# 输出带时间戳的片段
for segment in result["segments"]:
    print(f"[{segment['start']:.2f} - {segment['end']:.2f}] {segment['text']}")
```

## GPU 加速

```bash
# 安装 PyTorch GPU 版本
pip install torch torchvision torchaudio --index-url https://download.pytorch.org/whl/cu121

# Whisper 自动使用 GPU
import whisper
model = whisper.load_model("medium", device="cuda")
```

## 实时转录

```python
import whisper
import pyaudio
import numpy as np

model = whisper.load_model("small")
CHUNK = 1024
FORMAT = pyaudio.paInt16
CHANNELS = 1
RATE = 16000

p = pyaudio.PyAudio()
stream = p.open(format=FORMAT, channels=CHANNELS, rate=RATE, input=True, frames_per_buffer=CHUNK)

print("开始录音，按 Ctrl+C 停止...")

buffer = []
while True:
    data = stream.read(CHUNK)
    buffer.append(np.frombuffer(data, dtype=np.int16))
    
    # 累积 5 秒音频后识别
    if len(buffer) >= int(RATE / CHUNK * 5):
        audio = np.concatenate(buffer)
        audio = audio.astype(np.float32) / 32768.0
        
        result = model.transcribe(audio, language="zh")
        print(result["text"])
        
        buffer = []
```

## 优化技巧

### 1. VAD 过滤静音

```python
import webrtcvad

vad = webrtcvad.Vad(3)  # 敏感度 0-3

def is_speech(frame):
    return vad.is_speech(frame, RATE)
```

### 2. 指定语言提升速度

```python
# 不指定语言会先检测，增加耗时
result = model.transcribe("audio.mp3", language="zh")
```

### 3. 长音频分段处理

```python
from pydub import AudioSegment

audio = AudioSegment.from_mp3("long.mp3")
chunks = [audio[i:i+60000] for i in range(0, len(audio), 60000)]

for i, chunk in enumerate(chunks):
    chunk.export(f"temp_{i}.mp3", format="mp3")
    result = model.transcribe(f"temp_{i}.mp3")
    print(result["text"])
```

## 部署为 API 服务

```python
from fastapi import FastAPI, File, UploadFile
import whisper
import tempfile

app = FastAPI()
model = whisper.load_model("medium")

@app.post("/transcribe")
async def transcribe(file: UploadFile = File(...)):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        tmp.write(await file.read())
        tmp.flush()
        
        result = model.transcribe(tmp.name, language="zh")
        
        return {
            "text": result["text"],
            "segments": result["segments"]
        }

# 启动: uvicorn server:app --host 0.0.0.0 --port 8000
```

---

> Whisper 让语音识别变得简单，隐私敏感场景首选本地部署。
