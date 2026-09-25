"""Self-contained portfolio extract from a CIFAR-10 coursework implementation.

The original project combined a classifier with a reconstruction decoder and
saved visual checks for reconstructions and latent channels. This extract keeps
the model and joint loss calculation, without course handouts, dataset files,
or grading material.

Requires: PyTorch (`pip install torch`).
"""

import torch
from torch import nn
from torch.nn import functional as F


class DeconvCNN(nn.Module):
    """Classify a 32 x 32 RGB image and reconstruct it from its encoded state."""

    def __init__(self) -> None:
        super().__init__()
        self.conv1 = nn.Conv2d(3, 6, 5)
        self.pool = nn.MaxPool2d(2, 2)
        self.conv2 = nn.Conv2d(6, 16, 5)
        self.fc1 = nn.Linear(16 * 5 * 5, 120)
        self.fc2 = nn.Linear(120, 84)
        self.fc3 = nn.Linear(84, 10)
        self.deconv1 = nn.ConvTranspose2d(16, 6, kernel_size=5)
        self.deconv2 = nn.ConvTranspose2d(6, 3, kernel_size=5)

    def encode(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        z1 = self.pool(F.relu(self.conv1(x)))
        z2 = self.pool(F.relu(self.conv2(z1)))
        return z1, z2

    def classify_from_z2(self, z2: torch.Tensor) -> torch.Tensor:
        hidden = torch.flatten(z2, 1)
        hidden = F.relu(self.fc1(hidden))
        hidden = F.relu(self.fc2(hidden))
        return self.fc3(hidden)

    def decode_from_z2(self, z2: torch.Tensor) -> torch.Tensor:
        reconstruction = F.relu(self.deconv1(z2))
        reconstruction = F.interpolate(reconstruction, size=(14, 14), mode="nearest")
        reconstruction = F.relu(self.deconv2(reconstruction))
        reconstruction = F.interpolate(reconstruction, size=(32, 32), mode="nearest")
        return torch.tanh(reconstruction)

    def forward(self, x: torch.Tensor) -> tuple[torch.Tensor, torch.Tensor]:
        _, z2 = self.encode(x)
        return self.classify_from_z2(z2), self.decode_from_z2(z2)


def joint_loss(
    logits: torch.Tensor,
    reconstruction: torch.Tensor,
    labels: torch.Tensor,
    inputs: torch.Tensor,
    lambda_rec: float = 1.0,
) -> torch.Tensor:
    """Cross-entropy classification loss plus reconstruction mean-squared error."""
    classification_loss = F.cross_entropy(logits, labels)
    reconstruction_loss = F.mse_loss(reconstruction, inputs)
    return classification_loss + lambda_rec * reconstruction_loss


if __name__ == "__main__":
    model = DeconvCNN()
    batch = torch.randn(4, 3, 32, 32)
    labels = torch.tensor([0, 1, 2, 3])
    logits, reconstruction = model(batch)
    print({"logits": tuple(logits.shape), "reconstruction": tuple(reconstruction.shape)})
    print({"joint_loss": float(joint_loss(logits, reconstruction, labels, batch))})
