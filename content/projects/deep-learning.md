# PyTorch learning lab

Coursework-based explorations that connect neural-network concepts with Python and PyTorch implementation practice. Small teaching examples use synthetic data to make tensor behaviour and training choices easier to inspect.

## Focus

- LSTM gate calculations compared with PyTorch's LSTMCell using matched weights and numerical assertions.
- Scaled dot-product attention with causal and padding masks, including checks that masked positions receive zero attention weight.
- CNN shape tracing through forward hooks, convolution output-size calculations, and parameter counting.
- Separate training and evaluation loops with minibatches, dropout, no-gradient evaluation, and train/validation splits.

## Context

These study materials accompany an Applied Deep Learning course and were developed with AI-assisted study support. This page describes my learning workstream and implementation topics. It makes no benchmark, production-deployment, or original-research claims.

## What I take from this work

Shape checks, controlled examples, and small numerical assertions make abstract model behaviour concrete. The focus is on understanding why an implementation works and where it can fail.
