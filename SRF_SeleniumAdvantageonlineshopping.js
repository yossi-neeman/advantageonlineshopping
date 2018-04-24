var webdriver = require('selenium-webdriver'),
    By = webdriver.By,
    until = webdriver.until;
	assert = webdriver.Assert;
//Example for specifying values for input parameters from SRF UI
//Parameter names should be same as below
var HttpsProxyAgent = require('https-proxy-agent');
var categoryToFind = process.env.categoryToFind;    
var itemToFind = process.env.itemToFind;  
var expectedPrice = process.env.expectedPrice;
var driver;

var serverUrl = "https://srf-integ.dev-ga.srf-rnd.click:443/wd/hub";
process.env.SRF_CLIENT_ID = "t814866524_oauth2-0sEm7QSsCUAEHMrETBjQ@hpe.com";
process.env.SRF_CLIENT_SECRET="CWwbKNht5OM4ADDtT2A0";
process.env.SRF_REPORTER_URL = "https://srf-integ.dev-ga.srf-rnd.click:443";


var serverUrl = "https://ftaas-eu1.saas.hpe.com:443/wd/hub";
process.env.SRF_CLIENT_ID = "t851406649_oauth2-FVcLhihaNKfjmgCf0XXg@hpe.com";
process.env.SRF_CLIENT_SECRET="OsjxxL0MLwGcax8mbiuW";
process.env.SRF_REPORTER_URL = "https://ftaas-eu1.saas.hpe.com:443";

var proxyServer = "http://web-proxy.il.hpecorp.net:8080";
		
//In case if input parameters where not specified in SRF, default values will be used:
	if (categoryToFind==undefined)
	categoryToFind="speakers";

	if (itemToFind==undefined)
	itemToFind="Bose Soundlink Bluetooth Speaker III";
     
	if (expectedPrice==undefined)
	expectedPrice="$269.99";

describe('1st Describe', function () {
	before(function(done){                
		var capabilities = {
			platform: "Windows 10",
			version: "latest",
			testName: "Advantageonlineshopping",
            browserName: "chrome",
			resolution: "800x600",
			SRF_CLIENT_ID: process.env.SRF_CLIENT_ID,
			SRF_CLIENT_SECRET: process.env.SRF_CLIENT_SECRET
		};
		console.log("capabilities: ", capabilities);
        console.log("serverUrl: ", serverUrl);
        console.log("proxyServer: ", proxyServer);
		driver = new webdriver
		.Builder()
		.withCapabilities(capabilities)
		.usingServer(serverUrl)
		.usingHttpAgent(new HttpsProxyAgent(proxyServer))
		.build();
		
        driver.get('http://advantageonlineshopping.com/#').then(function() {
        console.log("open Online Shopping web page");
        done();
        });
	});
	
    it('1st it', function (done) {
		driver
		.wait(until.elementLocated(By.xpath("//DIV[@id=\"mobileSearch\"]/INPUT[1]")),5000)
		.then(function(searchFieldElement){
		    searchFieldElement.sendKeys(categoryToFind);
		})
        .then(()=>driver.findElement(By.css("#mobileSearch > #Layer_1")).click())
		.then(done);
    });
    
    it('should click on ' + itemToFind + ' in list of founded items', function (done) {
       var element = driver.findElement({partialLinkText:itemToFind, tagName:'LI'});
		driver
		.actions()
		.click(element)
		.perform();
        done();
    });
       
    it('should add item into the cart',function(done){
		driver
		.wait(until.elementLocated(By.xpath("//DIV[@id=\"productProperties\"]/DIV/BUTTON[normalize-space()=\"ADD TO CART\"]")),5000)
		.then(function(){
		    driver
		    .findElement(By.xpath("//DIV[@id=\"productProperties\"]/DIV/BUTTON[normalize-space()=\"ADD TO CART\"]"))
		    .click()
		    .then(done);
		});
	});
	
	it('should click on cart icon',function(done){
        driver      
        .findElement(By.xpath("//HEADER[1]/NAV[1]/UL[1]/LI[1]/A[1]"))
        .click()
		.then(done);
	}); 
	
	it('should check item price',function(done){
		var itemPrice = driver.findElement(By.css("div#shoppingCart > table > tfoot > tr:nth-child(1) > td:nth-child(2) > span:nth-child(2)"));
		itemPrice
		.getText()
		.then(function(elementText){
		    assert(elementText).equals(expectedPrice);
		})
		.then(done);
	});
	
	it('should click on checkout button',function(done){
        driver      
        .findElement(By.xpath("//DIV[@id=\"shoppingCart\"]/TABLE[1]/TFOOT[1]/TR[2]/TD[1]/BUTTON[1]"))
        .click()
		.then(done);
	});
	
	it('should fill existing user details',function(done){   
		driver
		.findElement(By.xpath("//DIV[@id=\"orderPayment\"]/DIV[1]/DIV[1]/DIV[1]/SEC-FORM[1]/SEC-VIEW[1]/DIV[1]/LABEL[1]"))
		.click()
		.then(
		    driver
		    .findElement(By.xpath("//DIV[@id=\"orderPayment\"]/DIV[1]/DIV[1]/DIV[1]/SEC-FORM[1]/SEC-VIEW[1]/DIV[1]/INPUT[1]"))
		    .sendKeys('SRF_DEMO')
		    .then(
		        driver
		        .findElement(By.xpath("//DIV[@id=\"orderPayment\"]/DIV[1]/DIV[1]/DIV[1]/SEC-FORM[1]/SEC-VIEW[2]/DIV[1]/LABEL[1]"))
		        .click()
		        .then(
		            driver
		            .findElement(By.xpath("//DIV[@id=\"orderPayment\"]/DIV[1]/DIV[1]/DIV[1]/SEC-FORM[1]/SEC-VIEW[2]/DIV[1]/INPUT[1]"))
		            .sendKeys('SRFdemo1234')
		            .then(done)
		            )));
	}); 
	
	 it('should click login button',function(done){
        driver
		.findElement(By.xpath("//DIV[@id=\"orderPayment\"]/DIV[1]/DIV[1]/DIV[1]/SEC-FORM[1]/SEC-SENDER[1]/A[1]"))
		.click()
		.then(done);
	}); 
	
	it('should check total price',function(done){
	    var totalPrice = driver.findElement(By.css("div#userCart > div:nth-child(5) > label:nth-child(2) > span"));
		totalPrice
		.getText()
		.then(function(elementText){
		    assert(elementText).equals(expectedPrice);
		})
		.then(done);
	}); 
	
	it('should click next button',function(done){
        driver
		.findElement(By.xpath("//DIV[@id=\"userSection\"]/DIV/DIV/BUTTON[normalize-space()=\"NEXT\"]"))
		.click()
		.then(done);
	});
	
	it('should specify user details for buying items',function(done){
	    
	    driver
		.findElement(By.xpath("//DIV/SEC-FORM/SEC-VIEW/DIV/LABEL[normalize-space()=\"SafePay username\"]"))
		.click()
		.then(
		    driver
		    .findElement(By.css("div#paymentMethod > div > div:nth-child(3) > sec-form > sec-view:nth-child(1) > div > input"))
		    .sendKeys('testTest')
		    .then(
		        driver
		        .findElement(By.xpath("//DIV/SEC-FORM/SEC-VIEW/DIV/LABEL[normalize-space()=\"SafePay password\"]"))
		        .click()
		        .then(
		            driver
		            .findElement(By.css("div#paymentMethod > div > div:nth-child(3) > sec-form > sec-view:nth-child(2) > div > input"))
		            .sendKeys('testTEST1234')
		            .then(done)
		            )));
	});
	
	it('should uncheck checkbox "save cahnges to profile"',function(done){
	    driver
		.findElement(By.xpath("//DIV[2]/SEC-FORM[1]/DIV[1]/INPUT[1]"))
		.isSelected()
		.then(function(elementSelectedState){
		    if (elementSelectedState)
		    driver
		    .findElement(By.xpath("//DIV[2]/SEC-FORM[1]/DIV[1]/INPUT[1]"))
		    .click()
		    .then(done); 
		});
	}); 
	
	it('should click on "Pay now" button',function(done){
        driver      
        .findElement(By.xpath("//DIV[2]/SEC-FORM[1]/DIV[2]/LABEL[1]/SEC-SENDER[1]/A[1]"))
        .click()
		.then(done);
	}); 
	
	it('should check price in order details',function(done){
	
    	 var totalPrice = driver.findElement(By.css("div#orderPaymentSuccess > div > div:nth-child(3) > div:nth-child(4) > label > a"));
		totalPrice
		.getText()
		.then(function(elementText){
		    assert(elementText).equals(expectedPrice);
		})
		.then(done);                
	});
    
    after(function(done){   
	    driver.quit().then(done);
    });
});