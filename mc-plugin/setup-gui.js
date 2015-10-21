// recebe uma entrada de dados do usuario e passa como parametro 
// para a funcao callback
// 
function promptModal(title, message, current, value, callback) {

	$('body')
			.append(
					'<div id="confirm-modal-div" class="modal hide fade">'
							+ '<div class="modal-header">'
							+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
							+ '<h3>'
							+ title
							+ '</h3>'
							+ '</div>'
							+ '<div class="modal-body">'
							+ '<div><p>'
							+ message
							+ '<input type="text" id="__promptModal" value="'
							+ value
							+ '">'
							+ '</p></div>'
							+ '</div>'
							+ '<div class="modal-footer">'
							+ '<button type="button" id="confirm-yes-button" class="btn btn-primary">Confirmar</button>'
							+ '<button type="button" id="confirm-no-button" data-dismiss="modal" class="btn">Cancelar</button>'
							+ '</div>' + '</div>');

	$('#confirm-modal-div').find('#confirm-yes-button').click(function(event) {
		var inputValue = $('#__promptModal').val();
		callback(current, inputValue);
		$('#confirm-modal-div').modal('hide');
		$('#confirm-modal-div').remove();
	});

	$('#confirm-modal-div').find('#confirm-no-button').click(function(event) {
		$('#confirm-modal-div').modal('hide');
		$('#confirm-modal-div').remove();
	});

	$('#confirm-modal-div').modal('show');
}

function confirmModal(title, message, current, callback) {

	$('body')
			.append(
					'<div id="confirm-modal-div" class="modal hide fade">'
							+ '<div class="modal-header">'
							+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
							+ '<h3>'
							+ title
							+ '</h3>'
							+ '</div>'
							+ '<div class="modal-body">'
							+ '<div><p>'
							+ message
							+ '</p></div>'
							+ '</div>'
							+ '<div class="modal-footer">'
							+ '<button type="button" id="confirm-yes-button" class="btn btn-primary">Sim</button>'
							+ '<button type="button" id="confirm-no-button" data-dismiss="modal" class="btn">Não</button>'
							+ '</div>' + '</div>');

	$('#confirm-modal-div').find('#confirm-yes-button').click(function(event) {
		callback(current);
		$('#confirm-modal-div').modal('hide');
		$('#confirm-modal-div').remove();
	});

	$('#confirm-modal-div').find('#confirm-no-button').click(function(event) {
		$('#confirm-modal-div').modal('hide');
		$('#confirm-modal-div').remove();
	});

	$('#confirm-modal-div').modal('show');
}

function messageModal(title, message) {

	$('body')
			.append(
					'<div id="message-modal-div" class="modal hide fade">'
							+ '<div class="modal-header">'
							+ '<button type="button" class="close" data-dismiss="modal" aria-hidden="true">&times;</button>'
							+ '<h3>'
							+ title
							+ '</h3>'
							+ '</div>'
							+ '<div class="modal-body">'
							+ '<div><p>'
							+ message
							+ '</p></div>'
							+ '</div>'
							+ '<div class="modal-footer">'
							+ '<button type="button" id="confirm-yes-button" class="btn btn-primary">Fechar</button>'
							+ '</div>' + '</div>');

	$('#message-modal-div').find('#confirm-yes-button').click(function(event) {
		$('#message-modal-div').modal('hide');
		$('#message-modal-div').remove();
	});

	$('#message-modal-div').modal('show');
}

