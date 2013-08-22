var target_action = '';
var target_profile = 'Default Dealer Profile';
localStorage.setItem('target_action', target_action);
localStorage.setItem('target_profile', target_profile);

//TESTING ONLY
//---------------------------------------------------------
var target_profile1 = 'Dealer Profile 1';
localStorage.setItem('target_profile1', target_profile1);

var target_profile2 = 'Dealer Profile 2';
localStorage.setItem('target_profile2', target_profile2);

var target_profile3 = 'Dealer Profile 3';
localStorage.setItem('target_profile3', target_profile3);
//---------------------------------------------------------

$(document).ready(function () {
	// alert('LOCKED + LOADED!');
	// supports_html5_storage();
	
	
	
	$('#profile_name').html(target_profile);
	$('#profile_default').html(target_profile);
	
	//TESTING ONLY
	//---------------------------------------------------------
	$('#profile_1').html(target_profile1);
	$('#profile_2').html(target_profile2);
	$('#profile_3').html(target_profile3);
	//---------------------------------------------------------
	
	// Make default profile active... change to last active
	$('.item_name h2').first().addClass('active');
	
	// Dropdown Menu Toggle
	$('#dropshade_trigger').toggle(function(){
    	$('#profile_mgmt').stop().animate({
			top: '-9%' }, 500, 'easeOutQuad', function() {
				// Animation complete
				$('#tabicon').css("background-image", "url(images/ui/arrow_up_FFF.png)");  
				
			}).animate({
			top: '-10%' }, 300, 'easeInQuad');
    	
    	
	},function(){
    	$('#profile_mgmt').stop().animate({
			top: '-100%' }, 500, 'easeInQuad', function() {
				// Animation complete
				$('#tabicon').css("background-image", "url(images/ui/arrow_down_FFF.png)");
			}).animate({
			top: '-99%' }, 300, 'easeOutQuad');
    	
	});
	
	
	
	// Rename Activator
	$('.item_name h2').click(function () {
		
		
		// Activate current profile
		$('.item_name h2').removeClass('active');
		$(this).addClass('active');
		
		var name = $(this).html();
		localStorage.setItem('target_profile', name);
		$('#profile_name').html(name);
		
		//$('#dropshade_trigger').trigger('click'); - Add delay
		setTimeout(function () {
   		$('#dropshade_trigger').trigger('click');
		}, 500);
		
		
	});
	
	
	// Hide input if clicked outside of field
	/*
	$('html').click(function() {
		if ($('.namedit_wrapper').is(':visible')) {
			$('.namedit_wrapper').fadeOut('fast', 'linear');
		}
	
	
	});
	
	$('.namedit').click(function(event){
    	event.stopPropagation();
	});
*/
	

	
/* Tabs Activiation
================================================== */

	var tabs = $('ul.tabs');

	tabs.each(function(i) {

		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href');

			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {

				e.preventDefault();

				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');

				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
				
				
				/* Add fancy animation here
				$('.mvisible').animate({
				opacity: 0}, 200, 'custom', function() {
				 // onClick -> Make current content fadeOut -> slideUp tab content --> slideDown new tab content ---> Make associated content fadeIn
				
				});
				*/
				
				
				
				

			}
		});
	});
	
	
	var tabs2 = $('ul.tabs2');

	tabs2.each(function(i) {

		//Get all tabs
		var tab = $(this).find('> li > a');
		tab.click(function(e) {
			
			//Get Location of tab's content
			var contentLocation = $(this).attr('href');

			//Let go if not a hashed one
			if(contentLocation.charAt(0)=="#") {

				e.preventDefault();

				//Make Tab Active
				tab.removeClass('active');
				$(this).addClass('active');

				//Show Tab Content & add active class
				$(contentLocation).show().addClass('active').siblings().hide().removeClass('active');
				
				
				/* Add fancy animation here
				$('.mvisible').animate({
				opacity: 0}, 200, 'custom', function() {
				 // onClick -> Make current content fadeOut -> slideUp tab content --> slideDown new tab content ---> Make associated content fadeIn
				
				});
				*/
				
				
				
				

			}
		});
	});
	
	
	
	// Make dollar sign appear or disappear next to field - REMOVED
	/*
	$('[id^="retailcost_"]').focus(function(event){
		//$(this).siblings('h6').removeClass('tmpvisible');
		$(this).siblings('h6').animate({
				opacity: 1}, 200, function() {
			
				$(this).siblings('h6').removeClass('tmpvisible');	 
				
				});
	});
	
	
	$('[id^="retailcost_"]').blur(function(event){
	
		if (this.value=='') {
		//this.value='0.00';
		
			$(this).siblings('h6').animate({
				opacity: 0}, 200, function() {
			
				$(this).siblings('h6').addClass('tmpvisible');	 
				
				});
		
		}
		
	});
	*/
	
	
	// Blur-Focus for all inputs need to add last know acceptable value if left blank
	$('input[type=text]').focus(function(event){
	
		var tmpval = $(this).val();
		$(this).val('');
		
	});
	
	$('input[type=text]').blur(function(event){
		var tmpval = $(this).val();
		if (tmpval == '') {
			$(this).val('');
		}
		
	});
	
	
	//onblur="if (this.value=='') this.value='Default Dealer Profile';" onfocus="if (this.value=='Default Dealer Profile') this.value='Default Dealer Profile';"
	
	
	
	
	
	//Preload images for hover events
	Image0= new Image(16,20)
	Image0.src = "images/ui/arrow_up_FFF.png"
	
	Image1= new Image(18,18)
	Image1.src = "images/ui/radradio_checked.png"
	
	Image2= new Image(12,13)
	Image2.src = "images/ui/checkmark.gif"
	
	Image3= new Image(12,20)
	Image3.src = "images/ui/clearx_pad.png"

	
});
// Document.ready: END



// Functions
var addProfile = function() {
	// Add new profiles
	alert('Add Profile Function - addProfile() - is currently empty. ');
	
}

var editProfile = function(target_profile) {
	// Edit profile
	//alert('Edit Profile Function - editProfile() - is currently empty. ');
	// Hide any other input field
		$('.namedit_wrapper').fadeOut('fast', 'linear');
		
	// Show associated input field	
	//alert(target_profile);
	var index = parseInt(target_profile);
	$('.namedit_wrapper').eq(index).fadeIn('fast', 'linear');
		
}

var applyProfile = function(target_profile) {
	// Edit profile
	//alert('Edit Profile Function - editProfile() - is currently empty. ');
	// Change name and hide associated input field
	
		$('.namedit_wrapper').fadeOut('fast', 'linear');
		//alert('Saved: '+localStorage.getItem('target_profile'));
		
		var index = parseInt(target_profile);
		// Use index to get name value
		var nameset = $('.list_item').eq(index).children().eq(0).children().eq(1).children().eq(0).children().eq(2).val();
		//alert(nameset);
		
		if (index == 0) {
			localStorage.setItem('target_profile', nameset);
			//alert('Saved: '+localStorage.getItem('target_profile'));
			$('#profile_default').html(nameset);
			
		}
		else {
			localStorage.setItem('target_profile'+target_profile, nameset);
			//alert('Saved: '+localStorage.getItem('target_profile'+target_profile));
			$('#profile_'+target_profile).html(nameset);
			
		}
		
		var statcheck = $('.item_name h2.active').attr('id');
		//alert(statcheck);
		// Remove 'profile_' from statcheck
		statcheck = statcheck.replace('profile_','');
		//alert(statcheck);
		
		if (statcheck == 'default'){
			statcheck = 0;
		}
		else {
			statcheck = parseInt(statcheck);
		}
			
		if (statcheck == index){
				$('#profile_name').html(nameset);
		}
			
}

var deleteProfile = function(target_profile) {
	// Delete profile
	// alert('Delete Profile Function - deleteProfile() - is currently empty. ');
	// Check if more than one profile exists and the value is not 'default', if not then alert no delete
	
	var index = parseInt(target_profile);
	
	if (index == 0) {
		alert('The Default Dealer Profile cannot be deleted.');
	}
	else {
		var x = confirm('Are you sure you would like to delete this profile?');
		
		if (x == true) {
        	$('.list_item').eq(index).remove();	
    	}
    	
		
			
	}
	
	
	
}


var resetCosts = function() {
	// Reset all cost factors to default
	alert('Reset Cost Function - resetCosts() - is currently empty. ');
	
}

var addProduct = function() {
	// Add Product to calculation results
	alert('Add Product Function - addProduct() - is currently empty. ');
	
}


var clearProduct = function() {
	// Remove Product from calculation results
	alert('Clear Product Function - clearProduct() - is currently empty. ');
	
}

var clearAllProducts = function() {
	// Remove All Products from calculation results
	alert('Clear All Products Function - clearAllProducts() - is currently empty. ');
	
}

var mCalculate = function() {
	// Add new profiles
	alert('Calculate Function - mCalculate() - is currently empty. ');
	
}

var exportData = function() {
	// Export data from calculation results
	alert('Export Data Function - exportData() - is currently empty. ');
	
}


// Check for local storage
var supports_html5_storage = function() { 
  		try {
  			console.log('HTML 5 localStorage is suppoted.');
    		return 'localStorage' in window && window['localStorage'] !== null;
  		} catch (e) {
  			console.log('HTML 5 localStorage is NOT SUPPORTED.');
    		return false;
  		}
	}