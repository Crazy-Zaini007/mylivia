var clientCode = "";
var host = "";
var isMob = false;

var survey = {};

var survayRes = {
    q1:{
        val:"",
        type:"radio"
    },
    q2: {
        val: "",
        type: "radio"
    },
    q3: {
        val: "",
        type: "num"
    },
	q4:{
        val:"",
        type:"radio"
    },
    q5: {
        val: "",
        type: "reject"
    },
    q6: {
        val: "",
        type: "radio"
    },
    q7: {
        val: "",
        type: "bmi"
    }
};

 
survey.Form = {
    Init: function () {

        isMob = window.mobilecheck();
        //Init Slider:   
        var dots = false; 
        var swipe = false;
        var fade = true;

        if(isMob){
            dots = true; 
            swipe = true;
            fade = false;
            $(".btnWrapper").hide();
        }
		else
        $(".btnWrapper").show();
            

            
        var slider = $('.single-item').slick({
            dots: dots,
            arrows: false,
            swipe: swipe,
            mobileFirst: true,
            adaptiveHeight:true,
            infinite: false,
            fade:fade,
            swipeToSlide: false,
            centerMode:false
    
        });
        //$('.single-item').slick('slickGoTo',  6);

        $(window).on('resize', function () {
           // $('.single-item').slick('resize');
        });

        $('.slick-dots li button').on('click', function (e) {
            e.stopPropagation();
        });

        $(".back").click(function () {
            $(".single-item").slick('slickPrev');
        });

        //Init slides 3:
        $('.q3Slider').slider({
            min: 1,
            max: 10,
            slide: function (event, ui) {			
                var value = ui.value;
                $("#q3 .currentNum").text(value.toString());
            },
            start: function (event, ui) {
                slider.slick("slickSetOption", "swipe", false);
            },
            stop: function (event, ui) {
                slider.slick("slickSetOption", "swipe", true);
            },
            value:5
        });
        $(".q3Slider").on("slide mouseenter mousedown",function(event){
          
        });

        $(".q3Slider .ui-slider-handle").append("<div class='currentNum'>5</div>");
        
        //Init slide 7:
        $(".hig2").hide();
        $('.q7Slider.height').slider({
            range: "min",
            min: 130,
            max: 200,
            value:170,
            slide: function (event, ui) {

                if($(".imp").hasClass("bmiOnBtn"))
                {  
                    var hight = survey.Form.BmiUnitsCalc("h", ui.value);              
                
                    $(this).parent().find(".hig1").text(hight[0] +" ft");
                    $(this).parent().find(".hig2").text(hight[1] +" in");
                }
                else{
                    $(this).parent().find(".hig1").text(ui.value +" cm");
                }
            },
            start: function (event, ui) {
                slider.slick("slickSetOption", "swipe", false);
            },
            stop: function (event, ui) {
                slider.slick("slickSetOption", "swipe", true);
            }
        });
        $('.q7Slider.weight').slider({
            range: "min",
            min: 30,
            max: 150,
            value:70,
            slide: function (event, ui) {
                if($(".imp").hasClass("bmiOnBtn"))
                {
                    var weight = survey.Form.BmiUnitsCalc("w", ui.value);
                    $(this).parent().find(".wei").text(weight[0] +" Lbs");
                }
                else
                {
                    $(this).parent().find(".wei").text((ui.value)+" kg");
                }
            },
            start: function (event, ui) {
                slider.slick("slickSetOption", "swipe", false);
            },
            stop: function (event, ui) {
                slider.slick("slickSetOption", "swipe", true);
            }
        });

        $(".met").click(function () {
            $(".hig2").hide();
            $(this).addClass("bmiOnBtn");
            $(".imp").removeClass("bmiOnBtn");

            $(".hig1").text( $('.q7Slider.height').slider("option", "value") +" cm");
            $(".wei").text( $('.q7Slider.weight').slider("option", "value") +" kg");

        });
        $(".imp").click(function () {
            $(".hig2").show();
            $(this).addClass("bmiOnBtn");
            $(".met").removeClass("bmiOnBtn");

            var cuttentH = $('.q7Slider.height').slider("option", "value");
            var currentW = $('.q7Slider.weight').slider("option", "value");

            var hight = survey.Form.BmiUnitsCalc("h", cuttentH);   
            var weight = survey.Form.BmiUnitsCalc("w", currentW);

            $(".hig1").text(hight[0] +" ft");
            $(".hig2").text(hight[1] +" in");
            $(".wei").text(weight[0] +" Lbs");

            //survey.Form.BmiCalc(cuttentH,currentW)
        });
       
        $(".q7Slider .ui-slider-handle").append("<div class='q7SliderDot'></div>");
        

        $("input[name='radio']").eq(0).click();
		$("input[name='radio2']").eq(0).click();
		
      
        //Collect Data On Next: slickCurrentSlide
       
		show_buttons();
		
		$(".next2").click(function(){			
			 $(".single-item").slick('slickNext');			 	
			 show_buttons();
		});
		
		$(".back2").click(function(){
			  $(".single-item").slick('slickPrev');
			show_buttons();	
		});
		
		//Q1
        $("#q1 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q1.val = parseInt($("#q1 input[name='q1Radio']:checked").val());     
        });   		
        //Q2
        $("#q2 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q2.val =  parseInt($("#q2 input[name='q2Radio']:checked").val());
        });
       
        //Q3
        $("#q3 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q3.val = parseInt($("#q3 .currentNum").eq(0).text());
        });

		//Q4
        $("#q4 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q4.val = parseInt($("#q4 input[name='q4Radio']:checked").val());        
        });  
		
        //Q5
        $("#q5 .next").click(function () {
            $(".single-item").slick('slickNext');
            var q5 = parseInt($("#q5 input[name='q5Radio']:checked").val());
            survayRes.q5.val = q5; 
            survey.Form.SetResTextInAdvance(q5);   
        }); 	
        //Q6
        $("#q6 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q6.val = parseInt($("#q6 input[name='q6Radio']:checked").val());   
        }); 
        //Q7
        $("#q7 .next").click(function () {
            $(".single-item").slick('slickNext');
            survayRes.q7.val = parseInt(survey.Form.GetBmiScor());
            survey.Form.InitGraph();            
        });	

        //Mobile
        if(isMob){
            $('.single-item').on('afterChange', function(event, slick, currentSlide){
                switch (currentSlide)
                {
                    case 1:
                        survayRes.q1.val = parseInt($("#q1 input[name='q1Radio']:checked").val());  
                        break;
                    case 2:
                        survayRes.q2.val =  parseInt($("#q2 input[name='q2Radio']:checked").val());
                        break;
                    case 3:
                        survayRes.q3.val = parseInt($("#q3 .currentNum").eq(0).text());  
                        break;
                    case 4:
                        survayRes.q4.val = parseInt($("#q4 input[name='q4Radio']:checked").val());   
                        break;
                    case 5:
                        var q5 = parseInt($("#q5 input[name='q5Radio']:checked").val());
                        survayRes.q5.val = q5; 
                        survey.Form.SetResTextInAdvance(q5);
                        break;
                    case 6:
                        survayRes.q6.val = parseInt($("#q6 input[name='q6Radio']:checked").val());  
                        break;
                    case 7:
                    {
                        survayRes.q7.val = parseInt(survey.Form.GetBmiScor());
                        survey.Form.InitGraph();  
                        break;
                    }
                    
    
                }
                
            });
        }
        
        $(".startOver").click(function () {
            location.reload();
        });
        $(".getlivia").click(function () {
            window.parent.location.href = "https://mylivia.com/product/livia-kit/";
        });
    },
    InitGraph: function () {

        var val = 0;
		var reject = false;

        Object.keys(survayRes).forEach(function (key) {
			
            if(survayRes[key].type == "radio") {
                    val = val + survayRes[key].val;
            }
			
            if(survayRes[key].type == "num"){
                val = val + survayRes[key].val +7;
            }
			
			if(survayRes[key].type == "reject" && survayRes[key].val == 1)
                reject = true;		
                	
            if(survayRes[key].type == "bmi")
			{
                val = val + survayRes[key].val;		
			}
            
        });

        if(reject)
            val = 0;
			
		if(val >= 100)
			val = 98;

        var gauge = new FlexGauge({
            appendTo: '#result',
            dialValue: (val).toFixed(0),
            arcFillPercent: val / 100,
            colorArcFg: "#65c8d0",
            arcStrokeFg: 12,
            arcStrokeBg: 0,
            styleArcBg: null,
            arcAngleStart: 1.5,
            arcAngleEnd: 3.45,
            arcBgColorLight: 255,
            animateNumerator:20        
        });

    },BmiUnitsCalc: function (type, val) {
        var res = [];
        if(type=="h")
        {
            var cm = val;
            var ft = Math.floor(cm / 30.48);
            var inc = Math.round(cm / 2.54);
            var delta = inc - (ft * 12);

            if(delta == 12){
                delta = 0;
                ft ++;
            }
            res[0] = ft;
            res[1] = delta;
        }
        if(type=="w")
        {
            res[0] = Math.round(val * 2.2);
        }

        return res;
    },BmiCalc: function (h,w) {
        return  (w / Math.pow(h/100, 2)).toFixed(1);
    },GetBmiScor: function (type, val) {
        var cuttentH = $('.q7Slider.height').slider("option", "value");
        var currentW = $('.q7Slider.weight').slider("option", "value");

        var hight = survey.Form.BmiUnitsCalc("h", cuttentH);   
        var weight = survey.Form.BmiUnitsCalc("w", currentW);
        var bmi = survey.Form.BmiCalc(cuttentH,currentW);
        var q7 = bmi > 18.5 && bmi < 24.9 ? 17 : //Healthy Weight
                 bmi < 18.5 ? 17 : //Underweight
                 bmi > 25 && bmi < 30 ? 7 : //Overweight
                 bmi > 30 ? 2 : 0; //Obese

        return q7;
    },SetResTextInAdvance:function(reject){
        $(".surveyRow.resultText .resExp").remove();
        if(reject == 1){
            if(isMob)
                $(".surveyRow.resultText").append("<div class='resExp'>Livia can not be used with a pacemaker</div>");
            else
                $(".surveyRow.resultText").append("<div class='resExp'> | Livia can not be used with a pacemaker</div>");
        }
    }
};

function show_buttons(){
	var a = 22/172;
	var b = -2 - a*640;
	var h  = $(window.parent).height() * a + b;
	
	$('.btnWrapper2').css("bottom",h+"px");
	
	if ($(".single-item").slick('slickCurrentSlide') == 0){
		$(".back2").hide();
		$(".next2").css("right","-69.3%");
	}else{
		$(".back2").show();
		$(".next2").css("right","-56%");
	}
	
	if ($(".single-item").slick('slickCurrentSlide') == 7){
		$(".next2").hide();
		$(".back2").css("top","-11px");
	}else{
		$(".next2").show();
		$(".back2").css("top","-5px");
	}
}

$(document).ready(function () {
    survey.Form.Init();
	show_buttons();
});

window.mobilecheck = function() {
    var check = false;
    (function(a){if(/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino/i.test(a)||/1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(a.substr(0,4))) check = true;})(navigator.userAgent||navigator.vendor||window.opera);
    return check;
};