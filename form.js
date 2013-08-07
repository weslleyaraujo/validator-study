var FormValidate = function(_form, _fields) {

	var validator      = this,
		formElement       = $(_form),
		fieldsElements    = [],
		errorsLabels      = 'label.error',
		fieldsValidations = [],
		errorMsgs         = {
			required:      'Campo obrigat&oacute;rio',
			email:         'Digite um email v&aacute;lido',
			matchOpposite: 'Senha inv&aacute;lida'
		},
		isValid = true;

	this.bindForm = function() {
		formElement.on( 'submit', function(e) {
			isValid = true;
			validator.validate();
			if (!isValid) {	
				e.preventDefault();
			}
		});
	};

	this.setFields = function(_fields) {
		var c = 0;
		for (var i in _fields) {
			fieldsElements[c]    = $('[name='+ i +']');
			fieldsValidations[c] = _fields[i];
			c++;
		}
	};

	this.validate = function(f) {

		// remove errors
		validator.removeErrors();

		for(var i in fieldsElements) {
			
			for(var v in fieldsValidations[i]) {
				
				switch(v) {
					case 'required' :
						if (!validator.isEmpty(fieldsElements[i])) {
							validator.createError(fieldsElements[i], errorMsgs[v]);
							isValid = false;
						}
					break;

					case 'email' :
						if (validator.errorExist(fieldsElements[i]))
							continue;
						if (!validator.validEmail(fieldsElements[i].val())) {
							validator.createError(fieldsElements[i], errorMsgs[v]);
							isValid = false;
						}
					break;

					case 'matchOpposite' :
						if (validator.errorExist(fieldsElements[i]))
							continue;
						if (fieldsElements[i].val() !== validator.fieldReverseValue(fieldsValidations[i][v])) {
							validator.createError(fieldsElements[i], errorMsgs[v]);
							isValid = false;
						}
					break;
				}

			}
		}
		return isValid;
	};

	this.fieldReverseValue = function(n) {
		return $('[name="'+ n +'"]').val().split('').reverse().join('');
	};

	this.createError = function(f, m) {
		f.after('<label for="'+ f.attr('name') +'" class="error">'+ m +'</label>');
	};

	this.errorExist = function(f) {
		return $('label[for='+ f.attr('name') +']').length === 1 ? true : false;
	};

	this.removeErrors = function() {
		$(errorsLabels).remove();
	};

	this.validEmail = function(m) {
		return m.match( /^([0-9a-zA-Z]+([_.-]?[0-9a-zA-Z]+)*@[0-9a-zA-Z]+[0-9,a-z,A-Z,.,-]*(.){1}[a-zA-Z]{2,4})+$/) === null ? false : true;
	};

	this.isEmpty = function(f) {
		return f.val() !== '' ? true : false;
	};

	this.init = function() {
		validator.setFields(_fields);
		validator.bindForm();
	};

};

new FormValidate(
	'#form-cadastro',
	{
		nome : {
			required: true
		},
		email : {
			required: true,
			email:    true
		},
		senha : {
			required:      true,
			matchOpposite: 'nome'
		}
	}
).init();