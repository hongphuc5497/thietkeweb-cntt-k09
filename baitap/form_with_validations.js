const schema = {
	fullName: {
		required: 'Vui lòng nhập họ và tên.'
	},
	email: {
		required: 'Vui lòng nhập email liên hệ.',
		pattern: /^[\w.+-]+@[\w-]+(\.[\w-]+)+$/,
		patternMessage: 'Email không hợp lệ, ví dụ: ten@gmail.com.'
	},
	phone: {
		required: 'Vui lòng nhập số điện thoại.',
		pattern: /^(0|\+84)\d{9}$/,
		patternMessage: 'Số điện thoại phải có dạng 0xxxxxxxxx hoặc +84xxxxxxxxx.'
	},
	position: {
		required: 'Vui lòng chọn vị trí ứng tuyển.'
	},
	experience: {
		required: 'Vui lòng nhập tóm tắt kinh nghiệm làm việc.'
	},
	skills: {
		required: 'Vui lòng nhập kỹ năng nổi bật.'
	}
};

const form = document.querySelector('.cv-form');
const successMessage = document.querySelector('.success-message');

const validateField = (name) => {
	const rule = schema[name];
	const value = form.elements[name].value.trim();
	let message = '';

	if (!value) {
		message = rule.required;
	} else if (rule.pattern && !rule.pattern.test(value)) {
		message = rule.patternMessage;
	}

	const field = form.elements[name].closest('.field');
	field.querySelector('.control').setAttribute('aria-invalid', message !== '');
	field.querySelector('.error').textContent = message;
	return message === '';
};

form.addEventListener('submit', (event) => {
	event.preventDefault();
	const isValid = Object.keys(schema).map(validateField).every(Boolean);

	if (!isValid) {
		form.querySelector('[aria-invalid="true"]').focus();
		return;
	}

	form.reset();
	successMessage.hidden = false;
});

form.addEventListener('input', (event) => {
	successMessage.hidden = true;
	if (event.target.getAttribute('aria-invalid') === 'true') {
		validateField(event.target.name);
	}
});

document.querySelectorAll('.select').forEach((select) => {
	const input = select.querySelector('input');
	const trigger = select.querySelector('.select-trigger');
	const valueText = select.querySelector('.select-value');
	const list = select.querySelector('.select-options');
	const options = Array.from(list.children);
	const placeholder = valueText.textContent;

	const open = () => {
		list.hidden = false;
		trigger.setAttribute('aria-expanded', 'true');
		const selected = options.find((option) => option.getAttribute('aria-selected') === 'true');
		(selected || options[0]).focus();
	};

	const close = () => {
		list.hidden = true;
		trigger.setAttribute('aria-expanded', 'false');
	};

	const setValue = (option) => {
		options.forEach((item) => item.setAttribute('aria-selected', item === option));
		input.value = option ? option.textContent : '';
		valueText.textContent = option ? option.textContent : placeholder;
		select.classList.toggle('has-value', Boolean(option));
	};

	const choose = (option) => {
		setValue(option);
		close();
		trigger.focus();
		successMessage.hidden = true;
		validateField(input.name);
	};

	trigger.addEventListener('click', () => {
		if (list.hidden) {
			open();
		} else {
			close();
		}
	});

	trigger.addEventListener('keydown', (event) => {
		if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
			event.preventDefault();
			open();
		}
	});

	list.addEventListener('click', (event) => {
		const option = event.target.closest('[role="option"]');
		if (option) {
			choose(option);
		}
	});

	list.addEventListener('keydown', (event) => {
		const index = options.indexOf(document.activeElement);

		if (event.key === 'ArrowDown') {
			options[Math.min(index + 1, options.length - 1)].focus();
		} else if (event.key === 'ArrowUp') {
			options[Math.max(index - 1, 0)].focus();
		} else if (event.key === 'Enter' || event.key === ' ') {
			choose(options[index]);
		} else if (event.key === 'Escape') {
			close();
			trigger.focus();
		} else if (event.key === 'Tab') {
			close();
			return;
		} else {
			return;
		}
		event.preventDefault();
	});

	document.addEventListener('click', (event) => {
		if (!select.contains(event.target)) {
			close();
		}
	});

	form.addEventListener('reset', () => setValue(null));
});
