/**************** OFFCANVAS MENU ******************/
$(document).ready(function()
{
	$('#overlay-lf, .close-lf, [data-sidebar-lf-toggle]').on('click', function()
	{
		$(document.body).toggleClass('lf-offcanvas-page');
		$(document.body).removeClass('rt-offcanvas-page');
		$('#offcanvas-lf').toggleClass('lf-active');
		$('#offcanvas-rt').removeClass('rt-active');
		return false;
	});
	$('#overlay-rt, .close-rt, [data-sidebar-rt-toggle]').on('click', function()
	{
		$(document.body).toggleClass('rt-offcanvas-page');
		$(document.body).removeClass('lf-offcanvas-page');
		$('#offcanvas-rt').toggleClass('rt-active');
		$('#offcanvas-lf').removeClass('lf-active');
		return false;
	});
});