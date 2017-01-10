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


	//cart
		if(getCookie('cartFormData') != undefined){
			restoreCartForm();
			TotalSum();
		}
		
		TotalSum();
		countItems();

		//добавление кол-ва товаров в корзине
		$(document).on("click",".cart__action-btn.plus",function(){
			event.preventDefault();
			var tmp_count = $(this).parent().prevAll(".cart__kol-vo").children("span").html();
			tmp_count++;
			// console.log(tmp_count);
			$(this).parent().prevAll(".cart__kol-vo").children("span").html(tmp_count);
			TotalItemSum($(this));
			TotalSum();
			countItems();
		});
		//уменьшение кол-ва товаров в корзине
		$(document).on("click",".cart__action-btn.minus",function(){
			event.preventDefault();
			var tmp_count = $(this).parent().prevAll(".cart__kol-vo").children("span").html();
			if(tmp_count > 1){
				tmp_count--;
				// console.log(tmp_count);
				$(this).parent().prevAll(".cart__kol-vo").children("span").html(tmp_count);
			}
			TotalItemSum($(this));
			TotalSum();
			countItems();
		});
		//удаление товара из корзины
		$(document).on("click",".cart__action-btn.delete",function(){
			event.preventDefault();
			$(this).parent().parent().slideUp().html("");
			//проверка корзины на пустоту
			if($("table tr").is("td")){
				$(".cart table").slideUp();
				$(".cart__empty").show();
			}
			TotalSum();
			isEmpty();
		});


		// if(Number($(".total").html()) == 0){
		// 	$("#OrderCart").hide();
		// }else{
		// 	TotalSum();
		// }

		/**
		 * Добавление в корзину
		 */
		// $(".moveToCart").on("click",function(){
		// 	var price = Number($($(this).prevAll().find(".goods-price")).html());
		// 	var name = $($(this).parent().find(".goods-name")).html();
		// 	var img = $($(this).parent().find("img")).attr("src");
		// 	addToCart(price, name, img);
		// 	TotalSum();
		// });

		/**
		 * Корзина пуста ?
		 */
		function isEmpty(){
			if (countItems() <= 0){
				$(".cart__table table, .cart__total, .cart__form").hide();
				$(".cart__empty").show(400);
			}
		}

		/**
		 * Функция подсчета суммы корзины
		 */
		function TotalItemSum(obj){
			var total = 0;
			var items = obj.parent().prevAll(".cart__kol-vo").children("span").html();
			var price = obj.parent().prevAll(".cart__price").children("span").html();
					total = Number(items*price);

			obj.parent().prevAll(".cart__sum").children("span").html(total);
			// console.log(total);
			return total;
		}

		/**
		 * Функция подсчета суммы корзины
		 */
		function TotalSum(){
			var total = 0;

			$(".cart__sum span").each(function(){
				total += Number($(this).html());
			});
			$("span.total").html(total);

			// console.log(total);

			$("input[name=money]").val(total);
			return total;
		}
		/**
		 * Функция подсчета кол-ва единиц в корзине
		 */
		function countItems(){
			var totalItems = 0;

			$(".cart__kol-vo span").each(function(){
				totalItems += Number($(this).html());
			});
			$("span.total-count").html(totalItems);
			$("input[name=items]").val(totalItems);
			return totalItems;
		}

		/**
		 * Функция добавления в корзину
		 */
		function addToCart(price, name, img){
			var htmlItem =
					"<div class='row cart-item'><div class='col-sm-3 cart-item-img'><img src='"+ img +"' alt=''/></div>"+
					"<div class='col-sm-5 cart-item-name'><span>"+ name +"</span></div>"+
					"<div class='col-sm-3 cart-item-price'><span>"+ price +"</span> р.</div>"+
					"<input type='hidden' name='goods[]' value='" + name + " = " + price + "'>"+
					"<div class='col-sm-1 cart-item-delete' title='Удалить'><i class='fa fa-close'></i></div>";
			$(".cart-table").append(htmlItem);
			setFormCookie();
		}

		/**
		 * Функция Удаление товара из корзины
		 */
		function delCartItem(cartClass){
			$(document).on("click",cartClass, function(){
				$(this).parent().remove();
				TotalSum();
				setFormCookie();
			});
		}

		/**
		 * Функция записывает форму в куки
		 */
		function setFormCookie(){
			var cartArray = new Array();
			$(".cart-table .cart-item").each(function(){
				var img     = $(this).find(".cart-item-img img").attr("src");
				var name    = $(this).find(".cart-item-name span").html();
				var price   = Number($(this).find(".cart-item-price span").html());
				var tmp = {"img":img,"name":name,"price":price};
				cartArray.push(tmp);
			});
			var str = JSON.stringify(cartArray);
			// запоминаем параметры формы в куки
			setCookie('cartFormData', str);
			//    console.log(getCookie("cartFormData"));
		}

		/**
		 * Функция Восстановление данных формы из куки
		 */
		function restoreCartForm(){
			var $form = $('#cartForm');
			var formData = getCookie('cartFormData');
			if(formData == undefined) {
				return;
			}
			else{
				var item = new Array();
				item = JSON.parse(formData);
				for(var i=0; i<item.length; i++){
					addToCart(item[i].price,item[i].name, item[i].img);
				}
			}
		}

		/**
		 * Функция очистки корзины
		 */
		function ClearCart(){
			deleteCookie('cartFormData');
			$(".cart-table").html("");
			$("#delivery-cash").html("0");
			TotalSum();
		}

		/**
		 *  возвращает cookie если есть или undefined
		 */
		function getCookie(name) {
			var matches = document.cookie.match(new RegExp(
					"(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
			))
			return matches ? decodeURIComponent(matches[1]) : undefined
		}

		/**
		 *  устанавливает cookie
		 */
		function setCookie(name, value, props) {
			props = props || {};
			var exp = props.expires
			if (typeof exp == "number" && exp) {
				var d = new Date();
				d.setTime(d.getTime() + exp*1000);
				exp = props.expires = d;
			}
			if(exp && exp.toUTCString) { props.expires = exp.toUTCString(); }

			value = encodeURIComponent(value);
			var updatedCookie = name + "=" + value;
			for(var propName in props){
				updatedCookie += "; " + propName;
				var propValue = props[propName];
				if(propValue !== true){ updatedCookie += "=" + propValue; }
			}
			document.cookie = updatedCookie;
		}

		/**
		 *  удаляет cookie
		 */
		function deleteCookie(name) {
			setCookie(name, null, { expires: -1 });
		}




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
			$('.tab-buttons1 span.'+ activeClass).css("border-bottom", "2px solid #7B519C");
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
			$('.tab-buttons2 span.'+ activeClass).css("border-bottom", "2px solid #7B519C");
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