var canvas = document.getElementById('canvas'),
	bgSection = 122.375,
	level,
	bgPosX = "1px",
	player,
	playerId,
	timeHolder,
	totalTime = 10,	//in minutes
	tempTime,
	currentAnswer,
	answer,
	team1Name, team2Name,
	score1, score2,
	teams = ['red', 'blue'],
	shootOptions = ['goal', 'saved', 'goal', 'post', 'goal'],
	
	
	isFirefox = typeof InstallTrigger !== 'undefined',   // Firefox 1.0+
	isIE = /*@cc_on!@*/false || !!document.documentMode; // At least IE6

	

$('#btn-start').click(startGame);
$('#btn-play').click(Play);
$('#btn-Kick').click(KickOff);

function startGame()
{
	document.getElementById("frame-1").style.display="none";
	document.getElementById("frame-0").style.display="block";
}

function KickOff()
{
	var team1 = document.getElementById('team1');
	var team2 = document.getElementById('team2');
	var flag = false;
	
	
	if(team2.value == "")
	{
		$(team2).addClass('invalidEntry').focus();
		flag = true;
	}
	if(team1.value == "")
	{
		$(team1).addClass('invalidEntry').focus();
		flag = true;
	}
	
	if(flag)
	{
		setTimeout(function()
		{
			$('.invalidEntry').removeClass('invalidEntry');
		}, 1000);
		return;
	}
	
	team1Name = team1.value;
	team2Name = team2.value;
	
	//$('#t1, #sta1').html(team1Name);
	//$('#t2, #sta2').html(team2Name);
	
	
	document.getElementById("frame-2").style.display="none";
	document.getElementById("frame-3").style.display="block";
	init();
}

function shootBall()
{
	var randomNum = Math.floor(Math.random() * 5);
	var shooter = shootOptions[randomNum];

	if(shooter == "goal")
	{
		if(playerId == 0)
		{
			$('#football').animate({top: '5px', left: '447px'}, 300, "swing").addClass('ballAni');
			setPlayer(1);
			score1++;
		} else if(playerId == 1)
		{
			$('#football').animate({top: '441px', left: '395px'}, 300, "swing").addClass('ballAni');
			setPlayer(0);
			score2++;
		}
		
		setTimeout(function()
		{
			$('.ballAni').removeClass('ballAni')
			level = 0;
			
			document.getElementById('shoot-wrapper').style.display = "none";
			setQuestion();
			document.getElementById('score-team1').value = score1;
			document.getElementById('score-team2').value = score2;
		}, 2000);

	}
	else if(shooter == "saved")
	{
		if(playerId == 0)
		{
			$('#blueplayer-4').css('transition', 'none').animate({top: '-4px', left: '454px'}, 250, "swing", function()
			{
				$(this).css('transition', '');
			});
			$('#football').animate({top: '41px', left: '460px'}, 300, "swing");
			setPlayer(1);
		}
		else if(playerId == 1)
		{
			$('#redplayer-1').css('transition', 'none').animate({top: '297px', left: '480px'}, 250, "swing", function()
			{
				$(this).css('transition', '');
			});
			$('#football').animate({top: '306px', left: '490px'}, 300, "swing");
			setPlayer(0);
		}
		
		setTimeout(function()
		{
			level = 0;
			
			document.getElementById('shoot-wrapper').style.display = "none";
			setQuestion();
		}, 2000);
		
	} else if(shooter == "post")
	{
		var myRandomPost = Math.floor(Math.random() * 2);
		var postValue = (myRandomPost == 0) ? "shootAgain" : "center";

		if(postValue == "center")
		{
			if(playerId == 0)
			{
				$('#football').animate({top: '-6px', left: '347px'}, 300, "swing");
				setPlayer(1);
			}
			else if(playerId == 1)
			{
				$('#football').animate({top: '356px', left: '325px'}, 300, "swing");
				setPlayer(0);
			}

			setTimeout(toCenter, 2000);
		}
	}
	
	setTimeout(function()
	{
		showPopup(shooter);
	}, 500);

}

function checkAns()
{
	var userAnswer = document.getElementsByName('uAnswer')[0].value;
	
	if(userAnswer == ""){
		$('#uAnswer').addClass('invalidEntry').focus();
		setTimeout(function()
		{
			$('#uAnswer').removeClass('invalidEntry');
		}, 700);
		return false;
		
	}
	document.getElementById('submitAns').setAttribute('disabled', 'disabled');
	if(playerId == 1)
	{
		if(userAnswer == answer)
		{
			var playerTurn = (playersPos[String(level)].players.blue);
			
			level++;
			//showPopup('Correct');

			$('#' + playerTurn).animate({top: ($('#football').position().top - 50) + 'px', left: $('#football').position().left + 'px'}, 200, "linear");
			setPlayer(1);
		}
		else
		{
			
			level--;
			toCenter();
			setPlayer(0);
			showPopup('Incorrect');
			return;
		}
	}else if(playerId == 0)
	{
		if(userAnswer == answer)
		{
			var playerTurn = (playersPos[String(level)].players.red);
			
			level--;
			//showPopup('Correct');
			$('#' + playerTurn).animate({top: $('#football').position().top + 'px', left: $('#football').position().left + 'px'}, 200, "linear");
			setPlayer(0);
		}
		else
		{
			
			level++;
			toCenter();
			setPlayer(1);
			showPopup('Incorrect');
			return;
		}
	}
	setTimeout(shoot, 950);
	
}

function shoot()
{
	setQuestion();
	if(level == 4 || level == -4)
	{
		document.getElementById('shoot-wrapper').style.display = 'block';
		$('#shoot').focus();
	}
}

function setPlayer(fix)
{
	if(fix == undefined)
	{
		if(level == -4)
		{
			playerId = 0;
		}else if(level == 4)
		{
			playerId = 1;
		}else
		{
			playerId = Math.floor(Math.random() * 2);
		}
	}
	else
	{
		playerId = parseInt(fix);
	}
	
	
	var myClass = (playerId == 0) ? "red" : "blue";
	$('#userAnswer').removeClass('red').removeClass('blue').addClass(myClass);


	player = teams[playerId];
	
	document.getElementById('userAnswer').setAttribute('data-team', this["team" + (playerId+1) + "Name"]);
}

function restartGame()
{
	location.href = document.URL;
}

function init()
{
	document.getElementById('btn-restart').onclick = restartGame;
    document.getElementById('submitAns').onclick = checkAns;
	document.getElementById('shoot').onclick = shootBall;
	if(isFirefox || isIE)
		$('#soccer').css('left', '-1px');
	
	level = 0;
	score1 = 0;
	score2 = 0;
	setPlayer();
	setGameTimer();
	setQuestion();
	
}

function setQuestion()
{
	var questionType = Math.abs(level);
	movePlayers();

	var questionPack = {};
	switch(questionType)
	{
		

		case 0:
				questionPack=setAdd();
				break;
		case 1:
				questionPack=setSub();
				break;
		case 2:		
				questionPack=setDto4B();
				break;
		case 3:
				questionPack=set4BtoD();
				break;
		default: 
				questionPack.title = "";
				break;
	}	//end of swtich
	
	answer = String(questionPack.answer);
	//console.log(String(questionPack.answer));
	document.getElementById('questionTitle').innerHTML = questionPack.title;
	
	document.getElementById('uAnswer').value = "";
	document.getElementById('uAnswer').focus();
	document.getElementById('submitAns').removeAttribute('disabled');
}

function movePlayers()
{
	var currentPos = playersPos[String(level)];
	$(canvas).animate({backgroundPosition: currentPos.backgroundPos}, 100);
	var bPlayers = document.getElementsByClassName('bluePlayer');
	for(var i=0; i<bPlayers.length; i++)
	{
		bPlayers[i].style.top = currentPos.bluePlayers[i][0];
		bPlayers[i].style.left = currentPos.bluePlayers[i][1];
	}
	
	var rPlayers = document.getElementsByClassName('redPlayer');
	for(var i=0; i<bPlayers.length; i++)
	{
		rPlayers[i].style.top = currentPos.redPlayers[i][0];
		rPlayers[i].style.left = currentPos.redPlayers[i][1];
	}
	
	

	$('#football').addClass('ballAni').animate({top: currentPos.ballPos[0], left: currentPos.ballPos[1]}, 200, function(){$(this).removeClass('ballAni');});
}

function toCenter()
{
	
	//var centerPos = -(pitchHeight/2) + (canvasHeight/2);
	var centerPos = -489.5;		//hardcoded - calculate the center position of background image [pitch]
	$('#football').addClass('ballAni');
	document.getElementById('shoot-wrapper').style.display = "none";
	level = 0;
	
	
	setTimeout(function(){
		$('#football').removeClass('ballAni');
	}, 2000);

	setPlayer();
	setQuestion();
}

function setGameTimer()
{
	//convert mins to seconds
	tempTime = totalTime * 60;
	
	timeHolder = setInterval(function()
	{
		if(tempTime == 0)
			gameover();
		
		var mins = Math.floor(tempTime / 60);
		var secs = tempTime % 60;
		
		document.getElementById('time-mins').value = FormatNumberLength(mins, 2);
		document.getElementById('time-secs').value = FormatNumberLength(secs, 2);
		
		tempTime--;		//decrease by 1 in every 1 second
	}, 1000);
}

function FormatNumberLength(num, length) {
    var r = "" + num;
    while (r.length < length) {
        r = "0" + r;
    }
    return r;
}

//parse decimal to binary
function dec2Bin(dec)
{
    if(dec >= 0)	return dec.toString(2);
    else			return (~dec).toString(2);
}

//bianry[question] to decimal[answer] conversion
function set4BtoD()
{
	var myObj = new Object();
	
	decimalNum = Math.floor(Math.random() * 14) + 1;
	
	myObj.answer = decimalNum;
	myObj.title = "Convert " + FormatNumberLength(dec2Bin(decimalNum), 4) + " to decimal."
	
	return myObj;
}

//decimal[question] to bianry[answer] conversion
function setDto4B()
{
	var myObj = new Object();
	
	decimalNum = Math.floor(Math.random() * 14) + 1;
	
	myObj.answer = FormatNumberLength(dec2Bin(decimalNum), 4);
	myObj.title = "Convert " + decimalNum + " to 4 bit binary."
	
	return myObj;
}

//bianry[question] to decimal[answer] conversion
/*function set8BtoD()
{
	var myObj = new Object();
	
	decimalNum = Math.floor(Math.random() * 150) + 100;
	
	myObj.answer = decimalNum;
	myObj.title = "Convert " + FormatNumberLength(dec2Bin(decimalNum), 8) + " to decimal."
	
	return myObj;
}

//decimal[question] to bianry[answer] conversion
function setDto8B()
{
	var myObj = new Object();
	
	decimalNum = Math.floor(Math.random() * 150) + 100;
	
	myObj.answer = FormatNumberLength(dec2Bin(decimalNum), 8);
	myObj.title = "Convert " + decimalNum + " to 8 bit binary."
	
	return myObj;
}*/

function setAdd()
{
var myObj=new Object();
a1=Math.floor(Math.random() * 14) + 1;
a2=Math.floor(Math.random() * 14) + 1;
myObj.answer=a1+a2;
myObj.title="ADD" + a1 + "and" + a2;
return myObj;
}

function setSub()
{
var myObj=new Object();
a1=Math.floor(Math.random() * 14) + 1;
a2=Math.floor(Math.random() * 14) + 1;
myObj.answer=a1-a2;
myObj.title="Subtract" + a1 + "from" + a2;
return myObj;
}

/*function setDiv()
{
var myObj=new Object();
a1=Math.floor(Math.random() * 14) + 1;
a2=Math.floor(Math.random() * 14) + 1;
myObj.answer=a1/a2;
myObj.title="Divide" + a1 + "from" + a2;
return myObj;
}

function setMul()
{
var myObj=new Object();
a1=Math.floor(Math.random() * 14) + 1; 
a2=Math.floor(Math.random() * 14)  + 1;
myObj.answer=a1*a2;
myObj.title="Multiply" + a1 + "and" + a2;
return myObj;
}*/



function showPopup(msg)
{
	if(msg.toLowerCase() == "incorrect")
	{
		$('#message').addClass('incorrectText');
	}
	else
	{
		$('#message').removeClass('incorrectText');
	}
	
	document.getElementById('message').innerHTML = msg;
	
	var myPopup = document.getElementById('popup');
	myPopup.style.display = 'block';
	
	setTimeout(function()
	{
		myPopup.style.display = 'none';
	}, 1000);
}

function gameover()
{
	clearInterval(timeHolder);
	document.getElementById('timeLeft').style.display = "none";
	document.getElementById('scoreStats').style.display = "none";
	document.getElementById('soccer').style.display = "none";
	document.getElementById('questionViewer').style.display = "none";
	document.getElementById('finishScreen').style.display = "block";
	document.getElementById('score-sTeam1').innerHTML = score1;
	document.getElementById('score-sTeam2').innerHTML = score2;
	var myMsgtoWinner = "";
	
	if(score1 == score2)
	{
		myMsgtoWinner = "Match Drawn.";
	}
	else if(score1 > score2)
	{
		myMsgtoWinner = "Congratulations! " + team1Name + " Wins.";
	}
	else if(score1 < score2)
	{
		myMsgtoWinner = "Congratulations! " + team2Name + " Wins.";
	}
	
	document.getElementById('winnerMsg').innerHTML = myMsgtoWinner;
}
