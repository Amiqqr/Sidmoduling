// Класс для управления формами
class FormManager {
    constructor() {
        this.currentForm = null;
        this.init();
    }

    init() {
        this.initConsultationForm();
        this.initPhoneMask();
        this.initCharacterCounter();
        this.initModal();
    }

    initConsultationForm() {
        const form = document.getElementById('consultationForm');
        if (!form) return;

        this.currentForm = form;

        // Обработчик отправки формы
        form.addEventListener('submit', async (e) => {
            e.preventDefault();

            // Валидация формы
            if (!this.validateForm()) {
                this.showFirstError();
                return;
            }

            // Получение данных формы
            const formData = this.getFormData();

            // Отправка формы
            await this.submitForm(formData);
        });

        // Реальная валидация
        form.querySelectorAll('input, textarea, select').forEach(field => {
            field.addEventListener('blur', () => this.validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('error')) {
                    this.validateField(field);
                }
            });
        });

        // Отдельная проверка для чекбокса (on change)
        const consentCheckbox = document.getElementById('consent');
        if (consentCheckbox) {
            consentCheckbox.addEventListener('change', () => this.validateField(consentCheckbox));
        }
    }

    validateForm() {
        let isValid = true;

        // Проверка обязательных полей
        const requiredFields = this.currentForm.querySelectorAll('[required]');
        requiredFields.forEach(field => {
            if (!this.validateField(field)) {
                isValid = false;
            }
        });

        // Проверка email (если указан)
        const emailField = document.getElementById('email');
        if (emailField && emailField.value && !this.validateField(emailField)) {
            isValid = false;
        }

        return isValid;
    }

    validateField(field) {
        const fieldId = field.id;
        const fieldType = field.type;
        let value = field.type === 'checkbox' ? field.checked : field.value.trim();
        const errorElement = document.getElementById(`${fieldId}Error`);

        // Очистка предыдущих состояний
        field.classList.remove('error', 'success');
        if (errorElement) {
            errorElement.style.display = 'none';
        }

        let isValid = true;
        let errorMessage = '';

        switch (fieldId) {
            case 'name':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Имя обязательно для заполнения';
                } else if (value.length < 2 || value.length > 100) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать от 2 до 100 символов';
                } else if (!/^[А-Яа-яЁё\s]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Имя должно содержать только русские буквы';
                }
                break;

            case 'phone':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Телефон обязателен для заполнения';
                } else if (!/^\+7\s\(\d{3}\)\s\d{3}-\d{2}-\d{2}$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите номер в формате: +7 (XXX) XXX-XX-XX';
                }
                break;

            case 'email':
                if (value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
                    isValid = false;
                    errorMessage = 'Введите корректный email адрес';
                }
                break;

            case 'message':
                if (value.length > 500) {
                    isValid = false;
                    errorMessage = 'Сообщение не должно превышать 500 символов';
                }
                break;

            case 'consent':
                if (!value) {
                    isValid = false;
                    errorMessage = 'Необходимо дать согласие на обработку данных';
                }
                break;
        }

        // Установка состояния
        if (!isValid && errorElement) {
            field.classList.add('error');
            errorElement.textContent = errorMessage;
            errorElement.style.display = 'block';
        } else if (field.type !== 'checkbox' && value) {
            field.classList.add('success');
        }

        return isValid;
    }

    getFormData() {
        const form = this.currentForm;
        const consentCheckbox = document.getElementById('consent');

        return {
            name: form.querySelector('#name').value.trim(),
            phone: form.querySelector('#phone').value.trim(),
            email: form.querySelector('#email').value.trim() || 'не указан',
            product: form.querySelector('#product').value || 'не указано',
            message: form.querySelector('#message').value.trim() || 'нет комментария',
            consent: consentCheckbox ? 'Да' : 'Нет' // Добавляем статус согласия
        };
    }

    async submitForm(formData) {
        const submitBtn = this.currentForm.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;

        // Показать состояние загрузки
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
        submitBtn.disabled = true;

        try {
            // Отправка заявки через API
            const result = await Database.createOrder(formData);

            if (result.success) {
                // Показать уведомление об успехе
                this.showSuccessModal();

                // Сброс формы
                this.resetForm();

                // Логирование успешной отправки
                console.log('Заявка успешно отправлена. ID:', result.order_id);
            } else {
                throw new Error('Ошибка при создании заказа');
            }
        } catch (error) {
            console.error('Ошибка отправки формы:', error);

            // Показать ошибку пользователю
            this.showErrorNotification();
        } finally {
            // Восстановить кнопку
            submitBtn.innerHTML = originalText;
            submitBtn.disabled = false;
        }
    }

    showSuccessModal() {
        const modal = document.getElementById('successModal');
        if (modal) {
            modal.classList.add('active');

            // Автоматическое закрытие через 5 секунд
            setTimeout(() => {
                if (modal.classList.contains('active')) {
                    modal.classList.remove('active');
                }
            }, 5000);
        }
    }

    showErrorNotification() {
        // Создание уведомления об ошибке
        const notification = document.createElement('div');
        notification.className = 'error-notification';
        notification.innerHTML = `
            <div style="position: fixed; top: 20px; right: 20px; background: #ff6b6b; color: white; padding: 15px 20px; border-radius: 10px; z-index: 3000; box-shadow: 0 5px 15px rgba(255, 107, 107, 0.3); display: flex; align-items: center; gap: 10px;">
                <i class="fas fa-exclamation-circle"></i>
                <span>Ошибка отправки. Пожалуйста, позвоните нам: +7 (923) 226-11-02</span>
                <button onclick="this.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; margin-left: 10px;">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;

        document.body.appendChild(notification);

        // Автоматическое удаление через 5 секунд
        setTimeout(() => {
            if (notification.parentNode) {
                notification.remove();
            }
        }, 5000);
    }

    resetForm() {
        if (!this.currentForm) return;

        // Сброс значений формы
        this.currentForm.reset();

        // Сброс счетчика символов
        const charCount = document.getElementById('charCount');
        if (charCount) {
            const countSpan = charCount.querySelector('span');
            if (countSpan) countSpan.textContent = '500';
        }

        // Сброс стилей полей
        this.currentForm.querySelectorAll('.form-control, .form-checkbox').forEach(input => {
            input.classList.remove('error', 'success');
            input.style.borderColor = '';
        });

        // Скрытие сообщений об ошибках
        this.currentForm.querySelectorAll('.error-message').forEach(error => {
            error.style.display = 'none';
        });
    }

    showFirstError() {
        const firstError = document.querySelector('.error-message[style*="block"]');
        if (firstError) {
            firstError.scrollIntoView({
                behavior: 'smooth',
                block: 'center'
            });

            // Мигание ошибки
            const field = firstError.previousElementSibling;
            if (field) {
                field.style.animation = 'errorFlash 0.5s 2';
                setTimeout(() => {
                    field.style.animation = '';
                }, 1000);
            }
        }
    }

    initPhoneMask() {
        const phoneInput = document.getElementById('phone');
        if (!phoneInput) return;

        phoneInput.addEventListener('input', function(e) {
            let value = this.value.replace(/\D/g, '');

            if (value.startsWith('7') || value.startsWith('8')) {
                if (value.startsWith('8')) value = '7' + value.substring(1);
                value = '+7 (' + value.substring(1, 4) + ') ' + value.substring(4, 7) + '-' + value.substring(7, 9) + '-' + value.substring(9, 11);
            }

            this.value = value.substring(0, 18);
        });

        // Добавление анимации для ошибок
        const style = document.createElement('style');
        style.textContent = `
            @keyframes errorFlash {
                0%, 100% { border-color: rgba(255, 255, 255, 0.2); }
                50% { border-color: #ff6b6b; }
            }
        `;
        document.head.appendChild(style);
    }

    initCharacterCounter() {
        const messageField = document.getElementById('message');
        const charCount = document.getElementById('charCount');

        if (!messageField || !charCount) return;

        const countSpan = charCount.querySelector('span');

        messageField.addEventListener('input', function() {
            const remaining = 500 - this.value.length;
            if (countSpan) {
                countSpan.textContent = remaining;
            }

            if (remaining < 0) {
                charCount.style.color = '#ff6b6b';
                this.classList.add('error');
            } else if (remaining < 50) {
                charCount.style.color = '#ffd166';
                this.classList.remove('error');
            } else {
                charCount.style.color = 'rgba(255,255,255,0.7)';
                this.classList.remove('error');
            }
        });
    }

    initModal() {
        const successModal = document.getElementById('successModal');
        const closeModalBtn = document.getElementById('closeModal');
        const closeSuccessBtn = document.getElementById('closeSuccess');

        if (!successModal) return;

        // Кнопка закрытия (крестик)
        if (closeModalBtn) {
            closeModalBtn.addEventListener('click', () => {
                successModal.classList.remove('active');
            });
        }

        // Кнопка "Закрыть" в окне
        if (closeSuccessBtn) {
            closeSuccessBtn.addEventListener('click', () => {
                successModal.classList.remove('active');
            });
        }

        // Закрытие при клике вне окна
        successModal.addEventListener('click', (e) => {
            if (e.target === successModal) {
                successModal.classList.remove('active');
            }
        });

        // Закрытие по Escape
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape' && successModal.classList.contains('active')) {
                successModal.classList.remove('active');
            }
        });
    }

    // Публичные методы для внешнего использования
    setFormProduct(productTitle) {
        const productSelect = document.getElementById('product');
        if (productSelect) {
            // Создаем опцию с названием продукта
            const option = document.createElement('option');
            option.value = `custom_${productTitle.toLowerCase().replace(/[^a-zа-яё0-9]/g, '_')}`;
            option.textContent = productTitle;

            // Удаляем предыдущие кастомные опции
            const existingOptions = productSelect.querySelectorAll('option[value^="custom_"]');
            existingOptions.forEach(opt => opt.remove());

            // Добавляем новую опцию
            productSelect.appendChild(option);
            productSelect.value = option.value;
        }
    }

    scrollToForm() {
        const formSection = document.getElementById('consultation');
        if (formSection) {
            const headerHeight = document.querySelector('header').offsetHeight;
            window.scrollTo({
                top: formSection.offsetTop - headerHeight - 20,
                behavior: 'smooth'
            });
        }
    }
}

// Инициализация глобального экземпляра
window.formManager = new FormManager();