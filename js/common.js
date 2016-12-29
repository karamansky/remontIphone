"use strict";

$(function(){

	$(document).ready(function(){

		//open menu icon
		$(document).on('click','#open-menu',function(){
			$(this).toggleClass('open');
			$(".header, .headhesive").toggleClass('show');
		});

	//плавающий header
		var header = new Headhesive('.header', {
			offset			: 500,
			classes: {
				clone			: 'headhesive',
				stick			: 'headhesive--stick',
				unstick		: 'headhesive--unstick'
			}
		});


	//navigation scroll to
		$(".head-menu, .to-top, .logo").on("click","a", function (event) {
			event.preventDefault();
			var id  = $(this).attr('href');
			//узнаем высоту от начала страницы до блока на который ссылается якорь
			var	top = $(id).offset().top - 80;
			//анимируем переход на расстояние - top за 1000 мс
			$('html, body').animate({scrollTop: top}, 1000);
		});


	//tabs
		$('.tab-content1 > div').hide();
		$('.tab-content1 > div').first().slideDown();
		$('.tab-buttons1 span').click(function(){
			var thisclass=$(this).attr('class');
			$('#lamp1').removeClass().addClass(thisclass);
			$('.tab-content1 > div').each(function(){
				if($(this).hasClass(thisclass)){
					$(this).fadeIn(500);
				}
				else{
					$(this).hide();
				}
			});
			var activeClass = $("#lamp1").attr("class");
			$('.tab-buttons1 span').css("border-bottom", "2px solid #ddd");
			$('.tab-buttons1 span.'+ activeClass).css("border-bottom", "2px solid #d40a27");
		});
		$('.tab-content2 > div').hide();
		$('.tab-content2 > div').first().slideDown();
		$('.tab-buttons2 span').click(function(){
			var thisclass=$(this).attr('class');
			$('#lamp2').removeClass().addClass(thisclass);
			$('.tab-content2>div').each(function(){
				if($(this).hasClass(thisclass)){
					$(this).fadeIn(200);
				}
				else{
					$(this).hide();
				}
			});
			var activeClass = $("#lamp2").attr("class");
			$('.tab-buttons2 span').css("border-bottom", "2px solid #ddd");
			$('.tab-buttons2 span.'+ activeClass).css("border-bottom", "2px solid #d40a27");
		});


	//owl-carousel
		$('.owl-carousel').owlCarousel({
			singleItem 				: true,
			itemClass					: ".item-owl",
			autoPlay					: false,
			pagination				: true
		});



	//popup
		$('.popup').magnificPopup({
			type: 'inline',
			preloader: false,
			focus: '#name',
			modal: true,
			fixedBgPos: true,
			mainClass: 'my-mfp-slide-bottom'
		});
		$('.image-popup').magnificPopup({
			type: 'image',
			closeOnContentClick: true,
			mainClass: 'mfp-img-mobile',
			image: {
				verticalFit: true
			}
		});
		$(document).on('click', '.close', function (e) {
			e.preventDefault();
			$.magnificPopup.close();
		});


	//wow animate initial
		new WOW().init();


	//скрыть/показать кнопку "НАВЕРХ"
		$(window).scroll(function(){
			if($('body').scrollTop() >= 500) { $('.to-top').show(); }
			else {	$('.to-top').hide(); }
		});


	//AJAX email send
		$('form').submit(function(event) {
			event.preventDefault();

			var id = $(this).attr('id');
			var data = $(this).serialize();

			$.ajax({
				url				: 'order.php',
				data			: data,
				type			: 'post',
				beforeSend: function(){
					/*отключаем кнопку, чтобы небыло лишних нажатий*/
					$('#'+ id +' input[type="submit"]').attr('disabled', 'disabled');
				},
				success		: function(){
					/*затираем введенные данные в полях ввода, чтобы показать, что форма обработана*/
					$('#'+ id +' input', '#'+ id + ' textarea').val('');
					/*закрываем popup-окно*/
					$.magnificPopup.close();
					/*Показвем сообщение об успешном завершении*/
					$(".success").fadeIn().delay(3000).fadeOut();
				},
				error			: function(){
					/*закрываем popup-окно*/
					$.magnificPopup.close();
					/*Показвем сообщение об неудачном завершении*/
					$(".error").fadeIn().delay(3000).fadeOut();
				},
				complete	: function(){
					/*Включаем кнопку*/
					$('#'+ id +' input[type="submit"]').removeAttr("disabled");
				}
			});
		});

	//masked phone input
		$(document).ready(function($){
			$("input[name='phone']").mask("+7 (999) 999-99-99");
		});



//==========EoF==============
	});
});