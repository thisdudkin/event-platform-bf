# 📋 Описание проекта

Платформа для управления событиями с отдельными сервисами backend и frontend.

---

## 📂 Структура проекта

```
/event-platform-bf
├── .docker/                # Конфигурации Docker
├── backend/                # Spring Boot приложение (API)
├── frontend/               # Веб-статический фронтенд
├── .gitignore
├── compose.yml             # Docker Compose
├── pom.xml                 # Maven POM для backend
└── README.md               # Этот файл
```

---

## 🚀 Требования

- Установленный Java 21+ и Maven (для backend)
- Python 3.x (для запуска простого HTTP-сервера)
- Git (рекомендуется)

---

## 🏃‍♂️ Запуск приложения

Все команды выполняются из корня проекта: `event-platform-bf`.

### 1. Запуск backend (Spring Boot)

1. Откройте терминал и перейдите в папку `backend`:

   ```bash
   cd backend
   ```

2. Запустите приложение командой Maven:

   ```bash
   mvn spring-boot:run
   ```

3. По умолчанию API будет доступно по адресу:

   ```
   http://localhost:8080/api
   ```

### 2. Запуск frontend (статический сервер)

1. В новом терминале перейдите в папку `frontend`:

   ```bash
   cd frontend
   ```

2. Запустите простой HTTP-сервер на порту 3030:

   ```bash
   python -m http.server 3030
   ```

3. Откройте браузер и перейдите по адресу:

   ```
   http://localhost:3030
   ```

---

## 🛑 Остановка

- Для остановки backend нажмите <kbd>Ctrl+C</kbd> в терминале, где запущен Maven.
- Для остановки frontend нажмите <kbd>Ctrl+C</kbd> в терминале, где запущен HTTP-сервер.

---

## 💡 Полезные команды

```bash
# Сборка backend без запуска
cd backend && mvn clean package

# Очистка и повторная сборка
cd backend && mvn clean install

# Проверка статуса Git
git status

# Запуск Docker Compose (если понадобится)
docker-compose -f compose.yml up --build
```
