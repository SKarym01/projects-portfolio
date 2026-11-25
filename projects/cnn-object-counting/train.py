import os
import re
import cv2
import numpy as np
import matplotlib.pyplot as plt
import tensorflow as tf
from sklearn.model_selection import train_test_split
from tensorflow.keras import layers, models, callbacks, optimizers

#  KONFIGURATION 
DATA_DIR = r"data"
TEST_DIR = r"test"
IMG_HEIGHT = 600
IMG_WIDTH = 800
BATCH_SIZE = 16 
EPOCHS = 80 

def load_data_minimal(directory):
    images = []
    labels = []
    
    if not os.path.exists(directory):
        print(f"Fehler: {directory} nicht gefunden.")
        return np.array([]), np.array([])

    print(f"Lade Daten aus {directory}...")
    files = [f for f in os.listdir(directory) if f.lower().endswith(".png")]
    
    for filename in files:
        match = re.search(r"O(\d+)", filename)
        if match:
            count = int(match.group(1))
            path = os.path.join(directory, filename)
            img = cv2.imread(path, cv2.IMREAD_GRAYSCALE)
            
            if img is not None:
                img = img.astype("float32") / 255.0
                img = np.expand_dims(img, axis=-1)
                images.append(img)
                labels.append(count)
                
    return np.array(images), np.array(labels)

def create_micro_model():

    model = models.Sequential()
    model.add(layers.Input(shape=(IMG_HEIGHT, IMG_WIDTH, 1)))
    
    # Augmentation
    model.add(layers.RandomFlip("horizontal_and_vertical"))
    
    #  LAYER 1 
    model.add(layers.Conv2D(8, (5, 5), strides=(2, 2), padding="same", activation="relu"))
    model.add(layers.AveragePooling2D(pool_size=(2, 2))) 

    # LAYER 2 
    model.add(layers.Conv2D(16, (3, 3), padding="same", activation="relu"))
    model.add(layers.AveragePooling2D(pool_size=(2, 2)))

    #  LAYER 3 
    model.add(layers.Conv2D(24, (3, 3), padding="same", activation="relu"))
    
    # AGGREGATION
    model.add(layers.GlobalAveragePooling2D())
    

    model.add(layers.Dense(1, activation="linear"))
    
    return model


# 1. Daten
X, y = load_data_minimal(DATA_DIR)
if len(X) == 0: exit()

X_train, X_val, y_train, y_val = train_test_split(X, y, test_size=0.2, random_state=42)

# 2. Modell
model = create_micro_model()
model.summary() 

# 3. Training
lr_schedule = optimizers.schedules.CosineDecay(0.01, decay_steps=EPOCHS*len(X_train)//BATCH_SIZE)
optimizer = optimizers.Adam(learning_rate=lr_schedule)

model.compile(optimizer=optimizer, loss="mean_absolute_error", metrics=["mae"])

callbacks_list = [
    callbacks.ModelCheckpoint("micro_model.keras", save_best_only=True, monitor="val_loss", verbose=0)
]

print(f"\n Training 'Micro-Net' ({EPOCHS} Epochen) ")
history = model.fit(
    X_train, y_train,
    epochs=EPOCHS,
    batch_size=BATCH_SIZE,
    validation_data=(X_val, y_val),
    callbacks=callbacks_list,
    verbose=1
)

# 4. Graph
plt.figure(figsize=(8,4))
plt.plot(history.history["loss"], label="Training MAE")
plt.plot(history.history["val_loss"], label="Validation MAE")
plt.title("Minimalist Model Training")
plt.xlabel("Epoch")
plt.ylabel("MAE")
plt.legend()
plt.grid(True)
plt.savefig("loss_graph.pdf")

# 5. Test
print("\n Testphase ")
best_model = models.load_model("micro_model.keras")
X_test, y_test = load_data_minimal(TEST_DIR)

if len(X_test) > 0:
    preds = best_model.predict(X_test, verbose=0).flatten()
    
    # Fehlerberechnung
    errors = np.abs(preds - y_test)
    mae = np.mean(errors)
    std = np.std(errors)
    
    print("="*40)
    print(f"Modell-Größe: {best_model.count_params()} Parameter")
    print(f"MAE:          {mae:.4f}")
    print(f"StdDev:       {std:.4f}")
    print("="*40)