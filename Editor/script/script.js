var dragFrom;
var dragTo;
var currNewId = 0;

var newBoxTop = 100;
var newBoxLeft = 100;

var canvas = this.__canvas = new fabric.Canvas('c');
canvas.selection = false;
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

var deleteIcon = document.createElement('img');
deleteIcon.src = './icons/delete_icon.png';

var editIcon = document.createElement('img');
editIcon.src = './icons/edit_icon.png';

var copyIcon = document.createElement('img');
copyIcon.src = './icons/copy_icon.png';

var branchesList = [];
var variables = { names:[""], faceEmotions:[""], animations:[""], cameraEffects:[""], SFX:[""] }; //Add default blank option
var tempVariables = { names:[""], faceEmotions:[""], animations:[""], cameraEffects:[""], SFX:[""] };

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

var tempBranch = null;

//Modal Stuff
var importExportModal = document.getElementById("importExportModal");
var importExportBtn = document.getElementById("importExportBtn");
var variablesModel = document.getElementById("variablesModel");
var variablesBtn = document.getElementById("variablesBtn");
var importExportModalCloseBtn = document.getElementById("importExportModalCloseBtn");



function ImportJson()
{
	try 
	{
		var jsonString = document.getElementById('jsonInputOutput').value;
		jsonObj = JSON.parse(jsonString);
		
		
		//Set variables
		variables = jsonObj.variables;
		
		//console.log(variables);
		
		canvas.clear();
		
		//Make Boxes
		for(var i = 0; i < jsonObj.branches.length; i++)
		{
			var branch = jsonObj.branches[i];
			
			//////////////////////////////
			//Json cleanup
			if(branch.choices == null)
			{
				branch.choices = [];
			}
			
			if(branch.choices.length > 0)
			{
				branch.nextBranchId = -1;
			}
			
			
			for(var j = 0; j < branch.messages.length; j++)
			{
				if(typeof branch.messages[j].name == 'undefined')
					branch.messages[j].name = "";
				
				if(typeof branch.messages[j].messageText == 'undefined')
					branch.messages[j].messageText = "";
					
				if(typeof branch.messages[j].messageText == 'undefined')
					branch.messages[j].messageText = "";
				
				if(typeof branch.messages[j].cameraNum == 'undefined' || branch.messages[j].cameraNum == '')
					branch.messages[j].cameraNum = -1;
					
				
				if(typeof branch.messages[j].cameraEffect == 'undefined')
					branch.messages[j].cameraEffect = "";
				
				if(typeof branch.messages[j].soundEffectBeforeMessage == 'undefined')
					branch.messages[j].soundEffectBeforeMessage = "";
				
				if(typeof branch.messages[j].soundEffectAfterMessage == 'undefined')
					branch.messages[j].soundEffectAfterMessage = "";
					
				if(typeof branch.messages[j].flagNumber == 'undefined' || branch.messages[j].flagNumber == '')
					branch.messages[j].flagNumber = -1;
					
				if(typeof branch.messages[j].hideMessageBox == 'undefined')
					branch.messages[j].hideMessageBox = false;
					
				if(typeof branch.messages[j].advanceAfterXSeconds == 'undefined' || branch.messages[j].advanceAfterXSeconds == '')
					branch.messages[j].advanceAfterXSeconds = -1;
					
				if(branch.messages[j].actorStates == null)
				{
					branch.messages[j].actorStates = [];
				}
				else
				{
					for(var k = 0; k < branch.messages[j].actorStates.length; k++)
					{
						if(branch.messages[j].actorStates[k].actorNumber == null)
							branch.messages[j].actorStates[k].actorNumber = "";
						
						if(branch.messages[j].actorStates[k].isSpeaking == null)
							branch.messages[j].actorStates[k].isSpeaking = false;
							
						if(branch.messages[j].actorStates[k].faceEmotion == null)
							branch.messages[j].actorStates[k].faceEmotion = "";
						
						if(branch.messages[j].actorStates[k].animation == null)
							branch.messages[j].actorStates[k].animation = "";
						
						if(branch.messages[j].actorStates[k].walkTo == null)
							branch.messages[j].actorStates[k].walkTo = false;
							
						if(branch.messages[j].actorStates[k].walkToPosition == null)
							branch.messages[j].actorStates[k].walkToPosition = {x:0,y:0,z:0};
							
						if(branch.messages[j].actorStates[k].teleportTo == null)
							branch.messages[j].actorStates[k].teleportTo = false;
							
						if(branch.messages[j].actorStates[k].teleportToPosition == null)
							branch.messages[j].actorStates[k].teleportToPosition = {x:0,y:0,z:0};
						
						if(branch.messages[j].actorStates[k].runTo == null)
							branch.messages[j].actorStates[k].runTo = false;
							
						if(branch.messages[j].actorStates[k].runToPosition == null)
							branch.messages[j].actorStates[k].runToPosition = {x:0,y:0,z:0};
							
						if(branch.messages[j].actorStates[k].setRotationEulerAngles == null)
							branch.messages[j].actorStates[k].setRotationEulerAngles = {x:0,y:0,z:0};
							
						if(branch.messages[j].actorStates[k].lookAtTarget == null)
							branch.messages[j].actorStates[k].lookAtTarget = false;
							
						if(branch.messages[j].actorStates[k].lookTargetPosition == null)
							branch.messages[j].actorStates[k].lookTargetPosition = {x:0,y:0,z:0};
						
						if(branch.messages[j].actorStates[k].lookSpeed == null)
							branch.messages[j].actorStates[k].lookSpeed = "";
						
						if(branch.messages[j].actorStates[k].stopLookAtTarget == null)
							branch.messages[j].actorStates[k].stopLookAtTarget = false;
					}
				}
			}
			//////////////////////////////
			
			var box = MakeBox(branch.choices.length, branch.branchId);
			if(branch.editorData)
			{
				box.top = branch.editorData.top;
				box.left = branch.editorData.left;
				box.setCoords();
				UpdateCirclePosition(box);
			}
			
		}
		
		
		//Make Lines
		for(var i = 0; i < jsonObj.branches.length; i++)
		{
			var fromBranch = jsonObj.branches[i];
			var box = GetBoxByBranchId(fromBranch.branchId);
			
			for(var j = 0; j < fromBranch.choices.length; j++)
			{
				if(fromBranch.choices[j].choiceOutcomeBranchId >= 0)
					AddLine(fromBranch.branchId, j, fromBranch.choices[j].choiceOutcomeBranchId);
			}
			
			if(fromBranch.nextBranchId >= 0)
			{
				AddLine(fromBranch.branchId, -1, fromBranch.nextBranchId);
			}
		}
		
		//Update preview text
		for(var i = 0; i < jsonObj.branches.length; i++)
		{
			var br = jsonObj.branches[i];
			
			if(br.messages.length > 0)
			{
				UpdateFirstMessagePreview(br.branchId,br.messages[0].messageText);
			}
			else
			{
				UpdateFirstMessagePreview(br.branchId,"");
			}	
		}
		
		
		branchesList = jsonObj.branches;
		
		canvas.renderAll();
		
		importExportModal.style.display = "none";
		document.getElementById('jsonInputOutput').value = "";
	}
	catch(err) 
	{
		alert("Error Parsing JSON");
	}

}
	
function ExportJson() 
{
	pullChartConnectionsToBranchList();
	
	console.log("tempVariables: ");
	console.log(tempVariables);
	console.log("variables: ");
	console.log(variables);
	
	console.log("canvas._objects: ");
	console.log(canvas._objects);
	console.log("branchesList: ");
	console.log(branchesList);
	console.log("tempBranch: ");
	console.log(tempBranch);

	var jsonObj  = { variables:variables, branches:branchesList }
	var jsonString = JSON.stringify(jsonObj);
	
	console.log(jsonString);
	document.getElementById('jsonInputOutput').value = jsonString;
}


function pullChartConnectionsToBranchList()
{
	for(var i = 0; i < branchesList.length; i++)
	{
		var branch = branchesList[i];
		var branchId = branch.branchId;
		
		var box = GetBoxByBranchId(branchId);
		
		branch.editorData = {
			top: box.top,
			left: box.left
		}
		
		if(box)
		{
			for(var j = 0; j < box.choiceCircles.length; j++)
			{
				console.log(box.choiceCircles[j].target);
				if(box.choiceCircles[j].target)
				{
					branch.choices[j].choiceOutcomeBranchId = box.choiceCircles[j].target.groupRef.id;
				}
			}
			
			if(box.circleOutput)
			{
				if(box.circleOutput.target)
				{
					branch.nextBranchId = box.circleOutput.target.groupRef.id;
				}
			}
		}
	}
}

function renderVariables()
{
	var variablesModelContent = [];
	
	variablesModelContent.push("<h4>Names</h4>");
	variablesModelContent.push("<br>");
	for(var i = 0; i < tempVariables.names.length; i++)
	{
		variablesModelContent.push("<div class='spencerRow'>");
		variablesModelContent.push("<label>" + i + ": </label>");
		variablesModelContent.push("<input type='text' class='variableNameInputs' id='nameVar" + i + "' value='" + tempVariables.names[i] + "'");
		
		if(i == 0)
		{
			variablesModelContent.push("disabled='disabled'>")
		}
		else
		{
			variablesModelContent.push(">")
		}
		
		//variablesModelContent.push("<button id='removeNameRowBtn" + i + "' class='removeRowButton' onclick='DeleteTempNameVariable(" + i + ")'><img src='./icons/remove_icon.png' style='width: 10px; height: 10px;'></button>");
		variablesModelContent.push("<br><br>");
		variablesModelContent.push("</div>");
	}
	variablesModelContent.push("<button id='AddNameRowBtn' class='addRowButton' onclick='AddTempNameVariable()'><img src='./icons/add_icon.png' style='width: 25px; height: 25px;'></button>");
	variablesModelContent.push("<br>");
	variablesModelContent.push("<br>");
	
	variablesModelContent.push("<h4>Face Emotions</h4>");
	variablesModelContent.push("<br>");
	for(var i = 0; i < tempVariables.faceEmotions.length; i++)
	{
		variablesModelContent.push("<div class='spencerRow'>");
		variablesModelContent.push("<label>" + i + ": </label>");
		variablesModelContent.push("<input type='text' class='variableFaceEmotionInputs' id='faceEmotionVar" + i + "' value='" + tempVariables.faceEmotions[i] + "'");
		if(i == 0)
		{
			variablesModelContent.push("disabled='disabled'>")
		}
		else
		{
			variablesModelContent.push(">")
		}
		//variablesModelContent.push("<button id='removefaceEmotionRowBtn" + i + "' class='removeRowButton' onclick='DeleteTempFaceEmotionVariable(" + i + ")'><img src='./icons/remove_icon.png' style='width: 10px; height: 10px;'></button>");
		variablesModelContent.push("<br><br>");
		variablesModelContent.push("</div>");
	}
	variablesModelContent.push("<button id='AddFaceEmotionRowBtn' class='addRowButton' onclick='AddTempFaceEmotionVariable()'><img src='./icons/add_icon.png' style='width: 25px; height: 25px;'></button>");
	variablesModelContent.push("<br>");
	variablesModelContent.push("<br>");
	
	variablesModelContent.push("<h4>Animations</h4>");
	variablesModelContent.push("<br>");
	for(var i = 0; i < tempVariables.animations.length; i++)
	{
		variablesModelContent.push("<div class='spencerRow'>");
		variablesModelContent.push("<label>" + i + ": </label>");
		variablesModelContent.push("<input type='text' class='variableAnimationInputs' id='animationVar" + i + "' value='" + tempVariables.animations[i] + "'");
		if(i == 0)
		{
			variablesModelContent.push("disabled='disabled'>")
		}
		else
		{
			variablesModelContent.push(">")
		}
		variablesModelContent.push("<br><br>");
		variablesModelContent.push("</div>");
	}
	variablesModelContent.push("<button id='AddAnimationRowBtn' class='addRowButton' onclick='AddTempAnimationVariable()'><img src='./icons/add_icon.png' style='width: 25px; height: 25px;'></button>");
	variablesModelContent.push("<br>");
	variablesModelContent.push("<br>");
	
	variablesModelContent.push("<h4>Camera Effects</h4>");
	variablesModelContent.push("<br>");
	for(var i = 0; i < tempVariables.cameraEffects.length; i++)
	{
		variablesModelContent.push("<div class='spencerRow'>");
		variablesModelContent.push("<label>" + i + ": </label>");
		variablesModelContent.push("<input type='text' class='variableCameraEffectInputs' id='cameraEffectVar" + i + "' value='" + tempVariables.cameraEffects[i] + "'");
		if(i == 0)
		{
			variablesModelContent.push("disabled='disabled'>")
		}
		else
		{
			variablesModelContent.push(">")
		}
		variablesModelContent.push("<br><br>");
		variablesModelContent.push("</div>");
	}
	variablesModelContent.push("<button id='AddcameraEffectRowBtn' class='addRowButton' onclick='AddTempCameraEffectsVariable()'><img src='./icons/add_icon.png' style='width: 25px; height: 25px;'></button>");
	variablesModelContent.push("<br>");
	variablesModelContent.push("<br>");
	
	
	variablesModelContent.push("<h4>SFX</h4>");
	variablesModelContent.push("<br>");
	for(var i = 0; i < tempVariables.SFX.length; i++)
	{
		variablesModelContent.push("<div class='spencerRow'>");
		variablesModelContent.push("<label>" + i + ": </label>");
		variablesModelContent.push("<input type='text' class='variableSFXInputs' id='SFXVar" + i + "' value='" + tempVariables.SFX[i] + "'");
		if(i == 0)
		{
			variablesModelContent.push("disabled='disabled'>")
		}
		else
		{
			variablesModelContent.push(">")
		}
		variablesModelContent.push("<br><br>");
		variablesModelContent.push("</div>");
	}
	variablesModelContent.push("<button id='AddSFXRowBtn' class='addRowButton' onclick='AddTempSFXVariable()'><img src='./icons/add_icon.png' style='width: 25px; height: 25px;'></button>");
	variablesModelContent.push("<br>");
	variablesModelContent.push("<br>");
	
	
	variablesModelContent = variablesModelContent.join("");
	
	document.getElementById("variablesModelContent").innerHTML = variablesModelContent;
	//document.getElementById("variablesModelContent").style.display = "block";
}

function renderMessageDetails(branchId)
{
	var editBranchInfoHTML = [];
	
	var editBranchHeaderHTML = [];
	var editBranchFooterHTML = [];
	
	editBranchHeaderHTML.push("<span id='editBranchCloseBtn' class='close' onclick='CancelEditBranch(" + branchId + ")'><img src='./icons/close_icon.png' style='width: 25px; height: 25px;'></span>");
	editBranchHeaderHTML.push("<h3>Editing Branch: " + branchId + "</h3>");
	
	
	
	//editBranchInfoHTML.push("<br>");
	var myBranch = GetBranch(branchId);
	
	editBranchInfoHTML.push("<div class='detailsSection'>");
	editBranchInfoHTML.push("<h2>Messages</h2>");
	editBranchInfoHTML.push("<br>");
	
	for(var i = 0; i < tempBranch.messages.length; i++)
	{
		editBranchInfoHTML.push("<div id='messageDetails" + i + "' class='messageBox'>");
		
		
		
		editBranchInfoHTML.push("<div class='myRow'>");
		
		editBranchInfoHTML.push("<div class='myColLeft'>");
		editBranchInfoHTML.push("<h3>Message</h3>");
		editBranchInfoHTML.push("</div>");

		editBranchInfoHTML.push("<div class='myColRight'>");
		editBranchInfoHTML.push("<button id='deleteMessage' onclick='DeleteMessage(" + branchId + ", " + i + ")' class='deleteButton' >Delete</button>");
		editBranchInfoHTML.push("</div>");

		editBranchInfoHTML.push("</div>");
		
		
		editBranchInfoHTML.push("<br>");
		
		editBranchInfoHTML.push("<label>Name:</label>");
		//editBranchInfoHTML.push("<input type='text' id='messageName" + i + "' value='" + tempBranch.messages[i].name  + "'><br><br>");
		editBranchInfoHTML.push("<select name='messageName" + i + "' id='messageName" + i + "'>");
		for(var j = 0; j < variables.names.length; j++)
		{
			if(tempBranch.messages[i].name == j)
			{
				console.log("MATCH");
				editBranchInfoHTML.push("<option value='" + j + "' selected>" + variables.names[j] + "</option>");
			}
			else
			{
				editBranchInfoHTML.push("<option value='" + j + "'>" + variables.names[j] + "</option>");
			}
		}
		editBranchInfoHTML.push("</select><br><br>");
		
		editBranchInfoHTML.push("<label>Message Text:</label>");
		editBranchInfoHTML.push("<textarea type='text' id='messageText" + i + "' class='messageText' spellcheck='true'>" + tempBranch.messages[i].messageText + "</textarea><br><br>");
		
		///
		editBranchInfoHTML.push("<div class='spencerrow'>");
			
		editBranchInfoHTML.push("<div class='spencercolumn'>");
		editBranchInfoHTML.push("<label>Camera Num:</label>");
		editBranchInfoHTML.push("<input type='text' id='cameraNum" + i + "' value='" + tempBranch.messages[i].cameraNum  + "' class='smallInput'><br><br>");
		editBranchInfoHTML.push("<label>SFX Before Message:</label>");
		//editBranchInfoHTML.push("<input type='text' id='soundEffectBeforeMessage" + i + "' value='" + tempBranch.messages[i].soundEffectBeforeMessage + "'><br><br>");
		
		editBranchInfoHTML.push("<select name='soundEffectBeforeMessage" + i + "' id='soundEffectBeforeMessage" + i + "'>");
		for(var j = 0; j < variables.SFX.length; j++)
		{
			if(tempBranch.messages[i].soundEffectBeforeMessage == j)
			{
				console.log("MATCH");
				editBranchInfoHTML.push("<option value='" + j + "' selected>" + variables.SFX[j] + "</option>");
			}
			else
			{
				editBranchInfoHTML.push("<option value='" + j + "'>" + variables.SFX[j] + "</option>");
			}
		}
		editBranchInfoHTML.push("</select><br><br>");
		
		editBranchInfoHTML.push("<label>Flag Number:</label>");
		editBranchInfoHTML.push("<input type='text' id='flagNumber" + i + "' value='" + tempBranch.messages[i].flagNumber + "'><br><br>");
		
		editBranchInfoHTML.push("<label>Advance After X Seconds:</label>");
		editBranchInfoHTML.push("<input type='text' id='advanceAfterXSeconds" + i + "' value='" + tempBranch.messages[i].advanceAfterXSeconds + "'>");
		
		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("<div class='spencercolumn'>");
		editBranchInfoHTML.push("<label>Camera Effect:</label>");
		//editBranchInfoHTML.push("<input type='text' id='cameraEffect" + i + "' value='" + tempBranch.messages[i].cameraEffect + "'><br><br>");
		
		editBranchInfoHTML.push("<select name='cameraEffect" + i + "' id='cameraEffect" + i + "'>");
		for(var j = 0; j < variables.cameraEffects.length; j++)
		{
			if(tempBranch.messages[i].cameraEffect == j)
			{
				console.log("MATCH");
				editBranchInfoHTML.push("<option value='" + j + "' selected>" + variables.cameraEffects[j] + "</option>");
			}
			else
			{
				editBranchInfoHTML.push("<option value='" + j + "'>" + variables.cameraEffects[j] + "</option>");
			}
		}
		editBranchInfoHTML.push("</select><br><br>");
		
		editBranchInfoHTML.push("<label>SFX After Message:</label>");
		//editBranchInfoHTML.push("<input type='text' id='soundEffectAfterMessage" + i + "' value='" + tempBranch.messages[i].soundEffectAfterMessage + "'><br><br>");
		
		editBranchInfoHTML.push("<select name='soundEffectAfterMessage" + i + "' id='soundEffectAfterMessage" + i + "'>");
		for(var j = 0; j < variables.SFX.length; j++)
		{
			if(tempBranch.messages[i].soundEffectAfterMessage == j)
			{
				console.log("MATCH");
				editBranchInfoHTML.push("<option value='" + j + "' selected>" + variables.SFX[j] + "</option>");
			}
			else
			{
				editBranchInfoHTML.push("<option value='" + j + "'>" + variables.SFX[j] + "</option>");
			}
		}
		editBranchInfoHTML.push("</select><br><br>");
		
		editBranchInfoHTML.push("<label>Hide Message Box:</label>");
		if(tempBranch.messages[i].hideMessageBox)
			editBranchInfoHTML.push("<input type='checkbox' id='hideMessageBox" + i + "' checked><br>");
		else
			editBranchInfoHTML.push("<input type='checkbox' id='hideMessageBox" + i + "' ><br>");
		
		
		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("</div>");
		///
		
		editBranchInfoHTML.push("<br><br>");
		
		//-------------------------------------
		
		editBranchInfoHTML.push("<div id ='ActorStates' class='indent'>");
		
		editBranchInfoHTML.push("<h3>Actor States</h3>");
		
		for(var j = 0; j < tempBranch.messages[i].actorStates.length; j++)
		{
			var thisActorState = tempBranch.messages[i].actorStates[j];
			
			editBranchInfoHTML.push("<div id='ActorState" + i + "_" + j + "' class='actorStateBox'>");
			
			
			editBranchInfoHTML.push("<div class='myRow'>");
		
			editBranchInfoHTML.push("<div class='myColLeft'>");
			editBranchInfoHTML.push("<h3>Actor State</h3>");
			editBranchInfoHTML.push("</div>");
			
			editBranchInfoHTML.push("<div class='myColRight'>");
			editBranchInfoHTML.push("<button id='deleteActorState' onclick='DeleteActorState(" + branchId + ", " + i + ", " + j + ")' class='deleteButton' >Delete</button>");
			editBranchInfoHTML.push("</div>");
			
			editBranchInfoHTML.push("</div>");
			
			editBranchInfoHTML.push("<br>");
			
			
			////////////////////
			editBranchInfoHTML.push("<div class='spencerrow'>");


			////////
			editBranchInfoHTML.push("<div class='spencercolumn'>");
			//+++++++++
			editBranchInfoHTML.push("<label>actorNumber:</label>");
			editBranchInfoHTML.push("<input type='text' id='actorNumber" + i + "_" + j + "' value='" + thisActorState.actorNumber + "' class='smallInput'><br><br>");
			
			
			editBranchInfoHTML.push("<label>faceEmotion:</label>");
			//editBranchInfoHTML.push("<input type='text' id='faceEmotion" + i + "_" + j + "' value='" + thisActorState.faceEmotion + "'><br><br>");
			editBranchInfoHTML.push("<select name='faceEmotion" + i + "_" + j + "' id='faceEmotion" + i + "_" + j + "'>");
			for(var k = 0; k < variables.faceEmotions.length; k++)
			{
				if(thisActorState.faceEmotion == k)
				{
					console.log("MATCH");
					editBranchInfoHTML.push("<option value='" + k + "' selected>" + variables.faceEmotions[k] + "</option>");
				}
				else
				{
					editBranchInfoHTML.push("<option value='" + k + "'>" + variables.faceEmotions[k] + "</option>");
				}
			}
			editBranchInfoHTML.push("</select><br><br>");
			
			
			//////////////
			editBranchInfoHTML.push("<label>walkTo:</label>");
			if(thisActorState.walkTo)
				editBranchInfoHTML.push("<input type='checkbox' id='walkTo" + i + "_" + j + "' checked>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='walkTo" + i + "_" + j + "'>");
				
			editBranchInfoHTML.push("<div style='width: 10px; display: inline-block;'></div>");
			
			//editBranchInfoHTML.push("<label>position:</label>");
			editBranchInfoHTML.push("<label>X:</label>");
			editBranchInfoHTML.push("<input type='text' id='walkToPositionX" + i + "_" + j + "' value='" + thisActorState.walkToPosition.x + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Y:</label>");
			editBranchInfoHTML.push("<input type='text' id='walkToPositionY" + i + "_" + j + "' value='" + thisActorState.walkToPosition.y + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Z:</label>");
			editBranchInfoHTML.push("<input type='text' id='walkToPositionZ" + i + "_" + j + "' value='" + thisActorState.walkToPosition.z + "' class='xyzInput'><br><br>");
			//////////////
			
			//////////////
			editBranchInfoHTML.push("<label>runTo:</label>");
			if(thisActorState.runTo)
				editBranchInfoHTML.push("<input type='checkbox' id='runTo" + i + "_" + j + "' checked>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='runTo" + i + "_" + j + "'>");
				
			editBranchInfoHTML.push("<div style='width: 10px; display: inline-block;'></div>");

			//editBranchInfoHTML.push("<label>position:</label>");
			editBranchInfoHTML.push("<label>X:</label>");
			editBranchInfoHTML.push("<input type='text' id='runToPositionX" + i + "_" + j + "' value='" + thisActorState.runToPosition.x + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Y:</label>");
			editBranchInfoHTML.push("<input type='text' id='runToPositionY" + i + "_" + j + "' value='" + thisActorState.runToPosition.y + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Z:</label>");
			editBranchInfoHTML.push("<input type='text' id='runToPositionZ" + i + "_" + j + "' value='" + thisActorState.runToPosition.z + "' class='xyzInput'><br><br>");
			//////////////
			
			
			//////////////
			editBranchInfoHTML.push("<label>lookAtTarget:</label>");
			if(thisActorState.lookAtTarget)
				editBranchInfoHTML.push("<input type='checkbox' id='lookAtTarget" + i + "_" + j + "' checked>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='lookAtTarget" + i + "_" + j + "' >");
				
			editBranchInfoHTML.push("<div style='width: 10px; display: inline-block;'></div>");
			
			//editBranchInfoHTML.push("<label>position:</label>");
			editBranchInfoHTML.push("<label>X:</label>");
			editBranchInfoHTML.push("<input type='text' id='lookTargetPositionX" + i + "_" + j + "' value='" + thisActorState.lookTargetPosition.x + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Y:</label>");
			editBranchInfoHTML.push("<input type='text' id='lookTargetPositionY" + i + "_" + j + "' value='" + thisActorState.lookTargetPosition.y + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Z:</label>");
			editBranchInfoHTML.push("<input type='text' id='lookTargetPositionZ" + i + "_" + j + "' value='" + thisActorState.lookTargetPosition.z + "' class='xyzInput'><br><br>");
			//////////////
			
			editBranchInfoHTML.push("<label>stopLookAtTarget:</label>");
			if(thisActorState.stopLookAtTarget)
				editBranchInfoHTML.push("<input type='checkbox' id='stopLookAtTarget" + i + "_" + j + "' checked><br><br>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='stopLookAtTarget" + i + "_" + j + "' ><br>");
			
			
			
			//+++++++++
			editBranchInfoHTML.push("</div>");
			////////


			////////
			editBranchInfoHTML.push("<div class='spencercolumn'>");
			//+++++++++
			
			editBranchInfoHTML.push("<label>isSpeaking:</label>");
			if(thisActorState.isSpeaking)
				editBranchInfoHTML.push("<input type='checkbox' id='isSpeaking" + i + "_" + j + "' checked><br><br>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='isSpeaking" + i + "_" + j + "'><br><br>");
			
			
			editBranchInfoHTML.push("<label>animation:</label>");
			//editBranchInfoHTML.push("<input type='text' id='animation" + i + "_" + j + "' value='" + thisActorState.animation + "'><br><br>");
			editBranchInfoHTML.push("<select name='animation" + i + "_" + j + "' id='animation" + i + "_" + j + "'>");
			for(var k = 0; k < variables.animations.length; k++)
			{
				if(thisActorState.animation == k)
				{
					console.log("MATCH");
					editBranchInfoHTML.push("<option value='" + k + "' selected>" + variables.animations[k] + "</option>");
				}
				else
				{
					editBranchInfoHTML.push("<option value='" + k + "'>" + variables.animations[k] + "</option>");
				}
			}
			editBranchInfoHTML.push("</select><br><br>");
			
			//////////////
			editBranchInfoHTML.push("<label>teleportTo:</label>");
			if(thisActorState.teleportTo)
				editBranchInfoHTML.push("<input type='checkbox' id='teleportTo" + i + "_" + j + "' checked>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='teleportTo" + i + "_" + j + "' >");
				
			editBranchInfoHTML.push("<div style='width: 10px; display: inline-block;'></div>");

			//editBranchInfoHTML.push("<label>position:</label>");
			editBranchInfoHTML.push("<label>X:</label>");
			editBranchInfoHTML.push("<input type='text' id='teleportToPositionX" + i + "_" + j + "' value='" + thisActorState.teleportToPosition.x + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Y:</label>");
			editBranchInfoHTML.push("<input type='text' id='teleportToPositionY" + i + "_" + j + "' value='" + thisActorState.teleportToPosition.y + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Z:</label>");
			editBranchInfoHTML.push("<input type='text' id='teleportToPositionZ" + i + "_" + j + "' value='" + thisActorState.teleportToPosition.z + "' class='xyzInput'><br><br>");
			//////////////
			
			
			//////////////
			editBranchInfoHTML.push("<label>setRotation:</label>");
			if(thisActorState.setRotation)
				editBranchInfoHTML.push("<input type='checkbox' id='setRotation" + i + "_" + j + "' checked>");
			else
				editBranchInfoHTML.push("<input type='checkbox' id='setRotation" + i + "_" + j + "' >");
			
			editBranchInfoHTML.push("<div style='width: 10px; display: inline-block;'></div>");
			
			//editBranchInfoHTML.push("<label>eulerAngles:</label>");
			editBranchInfoHTML.push("<label>X:</label>");
			editBranchInfoHTML.push("<input type='text' id='setRotationEulerAnglesX" + i + "_" + j + "' value='" + thisActorState.setRotationEulerAngles.x + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Y:</label>");
			editBranchInfoHTML.push("<input type='text' id='setRotationEulerAnglesY" + i + "_" + j + "' value='" + thisActorState.setRotationEulerAngles.y + "' class='xyzInput'>");
			editBranchInfoHTML.push("<label>Z:</label>");
			editBranchInfoHTML.push("<input type='text' id='setRotationEulerAnglesZ" + i + "_" + j + "' value='" + thisActorState.setRotationEulerAngles.z + "' class='xyzInput'><br><br>");
			//////////////
			
			
			editBranchInfoHTML.push("<label>lookSpeed:</label>");
			editBranchInfoHTML.push("<input type='text' id='lookSpeed" + i + "_" + j + "' value='" + thisActorState.lookSpeed + "' class='smallInput'><br>");
			
			
			
			
			
			//+++++++++
			editBranchInfoHTML.push("</div>");
			////////

			editBranchInfoHTML.push("</div>");
			////////////////////
			
			
			
			
			
			
			
			
			editBranchInfoHTML.push("</div>");
		}
		editBranchInfoHTML.push("<button id='addActorState' onclick='AddActorState(" + branchId + ", " + i + ")'>Add Actor State</button>");
		editBranchInfoHTML.push("</div>");
		//-------------------------------------
		
		editBranchInfoHTML.push("<br>");
		
		editBranchInfoHTML.push("<div class='myRow'>");
		
		editBranchInfoHTML.push("<div class='myColLeft'>");
		
		
		editBranchInfoHTML.push("<button id='addAfter' onclick='AddAfter(" + branchId + ", " + i + ")' >Add Message After</button>");
		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("<div class='myColRight'>");
		editBranchInfoHTML.push("<button id='moveUp' onclick='MoveUp(" + branchId + ", " + i + ")' ><img src='./icons/up_arrow.png' class='arrowUpDown'></button>");
		editBranchInfoHTML.push("<button id='moveDown' onclick='MoveDown(" + branchId + ", " + i + ")'><img src='./icons/down_arrow.png' class='arrowUpDown'></button>");
		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("</div>");
		
		
		editBranchInfoHTML.push("</div>");
		
		
		editBranchInfoHTML.push(editBranchInfoHTML);
	}
	
	editBranchInfoHTML.push("<button id='addMessage' onclick='AddAfter(" + branchId + ", " + i + ")'>Add Message</button><br><br>");
	
	editBranchInfoHTML.push("</div>");
	
	
	//////////////////////////////////////////////////////////
	editBranchInfoHTML.push("<div class='detailsSection'>");
	editBranchInfoHTML.push("<h2>Choices</h2>");
	
	editBranchInfoHTML.push("<br>");
	
	editBranchInfoHTML.push("<div id ='Choices'>");
	
	for(var j = 0; j < tempBranch.choices.length; j++)
	{
		editBranchInfoHTML.push("<div id='ChoiceBox" + j + "' class='choicesBox'>");
		
		
		editBranchInfoHTML.push("<div class='myRow'>");
		
		editBranchInfoHTML.push("<div class='myColLeft'>");
		editBranchInfoHTML.push("<h3>Choice</h3>");
		editBranchInfoHTML.push("</div>");

		editBranchInfoHTML.push("<div class='myColRight'>");
		editBranchInfoHTML.push("<button id='deleteChoice' onclick='DeleteChoice(" + branchId + ", " + j + ")' class='deleteButton' >Delete</button>");
		editBranchInfoHTML.push("</div>");

		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("<br>");
		editBranchInfoHTML.push("<label>choiceText:</label>");
		var choiceTextTemp = tempBranch.choices[j].choiceText;
		choiceTextTemp = choiceTextTemp.replace('\'', '&#39;');
		editBranchInfoHTML.push("<input type='text' id='choiceText" + j + "' value='" + choiceTextTemp  + "' spellcheck='true'><br><br>");

		
		
		editBranchInfoHTML.push("</div>");
	}
	
	editBranchInfoHTML.push("</div>");
	
	editBranchInfoHTML.push("<button id='addChoice' onclick='AddChoice(" + branchId + ")' >Add Choice</button><br>");
	editBranchInfoHTML.push("<label style='font-style: italic'>(changing number of choices will break links)</label><br><br>");
	editBranchInfoHTML.push("</div>");
	//////////////////////////////////////////////////////////

	editBranchFooterHTML.push("<button id='saveBranch' onclick='SaveBranch(" + branchId + ")' class='saveButton'>Save</button>");
	
	editBranchFooterHTML.push("<button id='cancelEditBracnh' onclick='CancelEditBranch(" + branchId + ")'>Cancel</button>");
	
	
	editBranchInfoHTML = editBranchInfoHTML.join("");
	editBranchHeaderHTML = editBranchHeaderHTML.join("");
	editBranchFooterHTML = editBranchFooterHTML.join("");
	
	document.getElementById("detailsSpace").innerHTML = editBranchInfoHTML;
	document.getElementById("detailsSpace").style.display = "block";
	document.getElementById("detailsModal").style.display = "block";
	
	document.getElementById("detailsModalHeader").innerHTML = editBranchHeaderHTML;
	document.getElementById("detailsModalFooter").innerHTML = editBranchFooterHTML;
}

function SetBoxNumberOfChoiceCircles(branchId, numChoices)
{
	var box = GetBoxByBranchId(branchId);
	
	box.choiceCircles.forEach(function(cir) 
	{
		cir.destroyLink();
		canvas.remove(cir);
	});
	box.choiceCircles = [];
	
	if(numChoices > 0)
	{
		if(box.circleOutput)
		{
			box.circleOutput.destroyLink();
			canvas.remove(box.circleOutput);
		}
	}
	
	canvas.renderAll();
	
	addOutputCircles(box, numChoices);
}

function UpdateFirstMessagePreview(branchId, firstMessageText)
{
	var box = GetBoxByBranchId(branchId);
	
	var previewLength = 15;
	
	var previewStr = firstMessageText;
	
	if(previewStr.length > previewLength)
	{
		previewStr = firstMessageText.substring(0,previewLength);
		previewStr += "...";
	}
	
	box.firstMessagePreviewText.set({
	  text: previewStr
	});
	
	canvas.renderAll();
}

function GetBoxByBranchId(branchId)
{
	for(var i = 0; i < canvas._objects.length; i++)
	{
		if(canvas._objects[i].id == branchId)
		{
			return canvas._objects[i];
		}
	}
}


function AddChoice(branchId)
{
	UpdateTempBranch();
	
	var dummyChoice = GetDummyChoice();
	
	tempBranch.choices.push(dummyChoice);
	
	tempBranch.nextBranchId = -1;
	
	renderMessageDetails(branchId);
}

function DeleteChoice(branchId, choicePosition)
{
	UpdateTempBranch();
	
	tempBranch.choices.splice(choicePosition, 1);
	
	renderMessageDetails(branchId);
}

function AddActorState(branchId, messagePosition)
{
	UpdateTempBranch();
	
	var actorState = GetDummyActorState();
	
	tempBranch.messages[messagePosition].actorStates.push(actorState);
	
	renderMessageDetails(branchId);
}

function DeleteActorState(branchId, messagePosition, actorStatePosition)
{
	UpdateTempBranch();
	tempBranch.messages[messagePosition].actorStates.splice(actorStatePosition, 1);
	renderMessageDetails(branchId);
}



function array_move(arr, old_index, new_index) {
	if (new_index >= arr.length) {
		var k = new_index - arr.length + 1;
		while (k--) {
			arr.push(undefined);
		}
	}
	arr.splice(new_index, 0, arr.splice(old_index, 1)[0]);
	return arr; // for testing
};


function MoveUp(branchId, messagePosition)
{
	if(messagePosition > 0)
	{
		UpdateTempBranch();
		
		array_move(tempBranch.messages, messagePosition, messagePosition-1);
		
		renderMessageDetails(branchId);
	}
}

function MoveDown(branchId, messagePosition)
{
	
	if(messagePosition < tempBranch.messages.length -1)
	{
		UpdateTempBranch();
	
		array_move(tempBranch.messages, messagePosition, messagePosition+1);
		
		renderMessageDetails(branchId);
	}
}

function AddAfter(branchId, messagePosition)
{
	UpdateTempBranch();
	
	var message = GetDummyMessage();
	
	if(messagePosition < 0)
	{
		tempBranch.messages.push(message);
	}
	else
	{
		tempBranch.messages.splice(messagePosition+1, 0, message);
	}
	
	
	renderMessageDetails(branchId);
}
/*
function AddEmptyNameVariable()
{
	console.log("AddEmptyNameVariable");
	variables.names.push("");
	renderVariables();
}

function AddNameVariable(name)
{
	console.log("AddNameVariable " + name);
	variables.names.push(name);
	renderVariables();
}

function DeleteNameVariable(position)
{
	variables.names.splice(position, 1);
	renderVariables();
}

function AddEmptyFaceEmotionVariable()
{
	console.log("AddEmptyFaceEmotionVariable");
	variables.faceEmotions.push("");
	renderVariables();
}

function AddFaceEmotionVariable(faceEmotion)
{
	console.log("AddFaceEmotionVariable " + faceEmotion);
	variables.faceEmotions.push(faceEmotion);
	renderVariables();
}

function DeleteFaceEmotionVariable(position)
{
	
	variables.faceEmotions.splice(position, 1);
	renderVariables();
}

function AddEmptyAnimationVariable()
{
	console.log("AddEmptyAnimationVariable");
	variables.animations.push("");
	renderVariables();
}

function AddAnimationVariable(animation)
{
	console.log("AddAnimationVariable " + animation);
	variables.animations.push(animation);
	renderVariables();
}

function DeleteAnimationVariable(position)
{
	variables.animations.splice(position, 1);
	renderVariables();
}
*/

function UpdateTempVariablesFromModal()
{
	console.log("UpdateTempVariablesFromModal: ");
	
	tempVariables.names = [];
	var rows1 = document.getElementsByClassName("variableNameInputs");
	for(var i= 0; i < rows1.length; i++)
	{
		var name = document.getElementById("nameVar"+i);
		console.log(name.value);
		tempVariables.names.push(name.value);
	}
	
	tempVariables.faceEmotions = [];
	var rows2 = document.getElementsByClassName("variableFaceEmotionInputs");
	for(var i= 0; i < rows2.length; i++)
	{
		var faceEmotion = document.getElementById("faceEmotionVar"+i);
		console.log(faceEmotion.value);
		tempVariables.faceEmotions.push(faceEmotion.value);
	}
	
	tempVariables.animations = [];
	var rows3 = document.getElementsByClassName("variableAnimationInputs");
	for(var i= 0; i < rows3.length; i++)
	{
		var animation = document.getElementById("animationVar"+i);
		console.log(animation.value);
		tempVariables.animations.push(animation.value);
	}
	
	tempVariables.cameraEffects = [];
	var rows4 = document.getElementsByClassName("variableCameraEffectInputs");
	for(var i= 0; i < rows4.length; i++)
	{
		var cameraEffect = document.getElementById("cameraEffectVar"+i);
		console.log(cameraEffect.value);
		tempVariables.cameraEffects.push(cameraEffect.value);
	}
	
	tempVariables.SFX = [];
	var rows5 = document.getElementsByClassName("variableSFXInputs");
	for(var i= 0; i < rows5.length; i++)
	{
		var SFX = document.getElementById("SFXVar"+i);
		console.log(SFX.value);
		tempVariables.SFX.push(SFX.value);
	}
}

function SetVariablesFromTempVariables()
{
	console.log("SetVariablesFromTempVariables");
	console.log(tempVariables);
	console.log(variables);
	
	variables.names = [];
	for(var i= 0; i < tempVariables.names.length; i++)
	{
		variables.names.push(tempVariables.names[i])
	}
	variables.faceEmotions = [];
	for(var i= 0; i < tempVariables.faceEmotions.length; i++)
	{
		variables.faceEmotions.push(tempVariables.faceEmotions[i])
	}
	
	variables.animations = [];
	for(var i= 0; i < tempVariables.animations.length; i++)
	{
		variables.animations.push(tempVariables.animations[i])
	}
	
	variables.cameraEffects = [];
	for(var i= 0; i < tempVariables.cameraEffects.length; i++)
	{
		variables.cameraEffects.push(tempVariables.cameraEffects[i])
	}
	
	variables.SFX = [];
	for(var i= 0; i < tempVariables.SFX.length; i++)
	{
		variables.SFX.push(tempVariables.SFX[i])
	}
	
	console.log(tempVariables);
	console.log(variables);
}

function SetTempVariablesFromVariables()
{
	//console.log("SetTempVariablesFromVariables");
	//console.log(tempVariables);
	//console.log(variables);
	
	tempVariables.names = [];
	for(var i= 0; i < variables.names.length; i++)
	{
		tempVariables.names.push(variables.names[i])
	}
	
	tempVariables.faceEmotions = [];
	for(var i= 0; i < variables.faceEmotions.length; i++)
	{
		tempVariables.faceEmotions.push(variables.faceEmotions[i])
	}
	
	tempVariables.animations = [];
	for(var i= 0; i < variables.animations.length; i++)
	{
		tempVariables.animations.push(variables.animations[i])
	}
	
	tempVariables.cameraEffects = [];
	for(var i= 0; i < variables.cameraEffects.length; i++)
	{
		tempVariables.cameraEffects.push(variables.cameraEffects[i])
	}
	
	tempVariables.SFX = [];
	for(var i= 0; i < variables.SFX.length; i++)
	{
		tempVariables.SFX.push(variables.SFX[i])
	}
	
	
	//console.log(tempVariables);
	//console.log(variables);
}

function CloseVariablesModal()
{
	console.log(tempVariables);
	console.log(variables);
	tempVariablesModel = variablesModel;
	variablesModel.style.display = "none";
}

function SaveVariablesModal()
{
	UpdateTempVariablesFromModal();
	
	SetVariablesFromTempVariables();
	
	variablesModel.style.display = "none";
}

/////////////////////////////////////////////////////////////
/*
function DeleteTempNameVariable(position)
{
	UpdateTempVariablesFromModal();
	tempVariables.names.splice(position, 1);
	renderVariables();
}
*/
/*
function DeleteTempFaceEmotionVariable(position)
{
	UpdateTempVariablesFromModal();
	tempVariables.faceEmotions.splice(position, 1);
	renderVariables();
}
*/
/*
function DeleteTempAnimationVariable(position)
{
	UpdateTempVariablesFromModal();
	tempVariables.animations.splice(position, 1);
	renderVariables();
*/

function AddTempNameVariable()
{
	UpdateTempVariablesFromModal();
	tempVariables.names.push("");
	renderVariables();
}

function AddTempFaceEmotionVariable()
{
	UpdateTempVariablesFromModal();
	tempVariables.faceEmotions.push("");
	renderVariables();
}

function AddTempAnimationVariable()
{
	UpdateTempVariablesFromModal();
	tempVariables.animations.push("");
	renderVariables();
}

function AddTempCameraEffectsVariable()
{
	UpdateTempVariablesFromModal();
	tempVariables.cameraEffects.push("");
	renderVariables();
}
function AddTempSFXVariable()
{
	UpdateTempVariablesFromModal();
	tempVariables.SFX.push("");
	renderVariables();
}
/////////////////////////////////////////////////////////////


  
function AddToBranchesList(branchId, numChoices)
{
	var branch = {
		branchId: branchId,
		messages: [],
		nextBranchId: -1,
		choices: []
	}

	for(var i = 0; i < numChoices; i++)
	{
		var dummyChoice = GetDummyChoice();
		branch.choices.push(dummyChoice);
	}

	branchesList.push(branch);
}
  
function GetBranch(branchId)
{
	var found = false;
	var i = 0;
	for(i = 0; i < branchesList.length; i++)
	{
		if(branchesList[i].branchId == branchId)
		{
			found = true;
			break;
		}
	}

	if (i > -1 && found) 
	{
		return branchesList[i];
	}
}
  
function DeleteMessage(branchId, position)
{
	UpdateTempBranch();
	tempBranch.messages.splice(position, 1);
	renderMessageDetails(branchId);
}

function CancelEditBranch(branchId)
{
	document.getElementById("detailsSpace").innerHTML = "";
	document.getElementById("detailsSpace").style.display = "none";
	document.getElementById("detailsModal").style.display = "none";
	
	document.getElementById("detailsModalHeader").innerHTML = "";
	document.getElementById("detailsModalFooter").innerHTML = "";
	

	tempBranch.messages = null;
}

function UpdateTempBranch()
{
	var i = 0;

	for(var i = 0; i < tempBranch.messages.length; i++)
	{
		var name = document.getElementById("messageName" + i).value;
		var messageText = document.getElementById("messageText" + i).value;
		var cameraNum = document.getElementById("cameraNum" + i).value;
		var cameraEffect = document.getElementById("cameraEffect" + i).value;
		var soundEffectBeforeMessage = document.getElementById("soundEffectBeforeMessage" + i).value;
		var soundEffectAfterMessage = document.getElementById("soundEffectAfterMessage" + i).value;
		var flagNumber = document.getElementById("flagNumber" + i).value;
		var hideMessageBox = document.getElementById("hideMessageBox" + i).checked;
		var advanceAfterXSeconds = document.getElementById("advanceAfterXSeconds" + i).value;
		
		var actorStatesListTemp = [];
		
		for(var j = 0; j < tempBranch.messages[i].actorStates.length; j++)
		{
			var actorStateTemp = {
				actorNumber: document.getElementById("actorNumber" + i + "_" + j).value,
				isSpeaking: document.getElementById("isSpeaking" + i + "_" + j).checked,
				faceEmotion: document.getElementById("faceEmotion" + i + "_" + j).value,
				animation: document.getElementById("animation" + i + "_" + j).value,
				
				walkTo: document.getElementById("walkTo" + i + "_" + j).checked,
				walkToPosition: { 
					x: document.getElementById("walkToPositionX" + i + "_" + j).value, 
					y: document.getElementById("walkToPositionY" + i + "_" + j).value, 
					z: document.getElementById("walkToPositionZ" + i + "_" + j).value 
				},
				
				teleportTo: document.getElementById("teleportTo" + i + "_" + j).checked,
				teleportToPosition: { 
					x: document.getElementById("teleportToPositionX" + i + "_" + j).value, 
					y: document.getElementById("teleportToPositionY" + i + "_" + j).value, 
					z: document.getElementById("teleportToPositionZ" + i + "_" + j).value 
				},
				
				runTo: document.getElementById("runTo" + i + "_" + j).checked,
				runToPosition: { 
					x: document.getElementById("runToPositionX" + i + "_" + j).value, 
					y: document.getElementById("runToPositionY" + i + "_" + j).value, 
					z: document.getElementById("runToPositionZ" + i + "_" + j).value 
				},
				
				setRotation: document.getElementById("setRotation" + i + "_" + j).checked,
				setRotationEulerAngles: { 
					x: document.getElementById("setRotationEulerAnglesX" + i + "_" + j).value, 
					y: document.getElementById("setRotationEulerAnglesY" + i + "_" + j).value, 
					z: document.getElementById("setRotationEulerAnglesZ" + i + "_" + j).value 
				},
				
				
				lookAtTarget: document.getElementById("lookAtTarget" + i + "_" + j).checked,
				lookTargetPosition: { 
					x: document.getElementById("lookTargetPositionX" + i + "_" + j).value, 
					y: document.getElementById("lookTargetPositionY" + i + "_" + j).value, 
					z: document.getElementById("lookTargetPositionZ" + i + "_" + j).value 
				},
				
				lookSpeed: document.getElementById("lookSpeed" + i + "_" + j).value,
				stopLookAtTarget: document.getElementById("stopLookAtTarget" + i + "_" + j).checked
				
				
			}
			
			actorStatesListTemp.push(actorStateTemp);
		}
		
		var message = {
			name: name,
			messageText: messageText,
			cameraNum: cameraNum,
			cameraEffect: cameraEffect,
			soundEffectBeforeMessage: soundEffectBeforeMessage,
			soundEffectAfterMessage: soundEffectAfterMessage,
			flagNumber: flagNumber,
			hideMessageBox: hideMessageBox,
			advanceAfterXSeconds: advanceAfterXSeconds,
			actorStates: actorStatesListTemp,
		}
		tempBranch.messages[i] = message;
	}

	var choices = [];

	for(var j = 0; j < tempBranch.choices.length; j++)
	{
		var choiceText = document.getElementById("choiceText" + j).value;
		
		
		var choiceOutcomeBranchId = -1;
		
		if(document.getElementById("choiceOutcomeBranchId" + j))
			choiceOutcomeBranchId = document.getElementById("choiceOutcomeBranchId" + j).value;
		
		
		choices.push({
			choiceText: choiceText, 
			choiceOutcomeBranchId: choiceOutcomeBranchId
		});
	}

	tempBranch.choices = choices;
}


function SaveBranch(branchId)
{

	UpdateTempBranch();

	var myBranch = GetBranch(branchId);

	if(tempBranch.choices.length != myBranch.choices.length)
	{
		SetBoxNumberOfChoiceCircles(branchId, tempBranch.choices.length);
	}
	
	if(tempBranch.messages.length > 0)
	{
		UpdateFirstMessagePreview(branchId,tempBranch.messages[0].messageText);
	}
	else
	{
		UpdateFirstMessagePreview(branchId,"");
	}	
		
	var found = false;
	var i = 0;
	for(i = 0; i < branchesList.length; i++)
	{
		if(branchesList[i].branchId == branchId)
		{
			found = true;
			break;
		}
	}

	if (i > -1 && found) 
	{
		branchesList[i] = JSON.parse(JSON.stringify(tempBranch));;
	}

	document.getElementById("detailsSpace").innerHTML = "";
	document.getElementById("detailsSpace").style.display = "none";
	document.getElementById("detailsModal").style.display = "none";
	
	document.getElementById("detailsModalHeader").innerHTML = "";
	document.getElementById("detailsModalFooter").innerHTML = "";

	tempBranch = null;
}
  
function GetDummyMessage()
{
	var message = {
		name: "",
		messageText: "",
		cameraNum: -1,
		cameraEffect: "",
		soundEffectBeforeMessage: "",
		soundEffectAfterMessage: "",
		flagNumber: -1,
		hideMessageBox: false,
		advanceAfterXSeconds: -1,
		actorStates: [],
	}
	return message;
}
  
function GetDummyActorState()
{
	var actorStateTemp = {
		actorNumber: "",
		isSpeaking: false,
		faceEmotion: "",
		animation: "",
		walkTo: false,
		walkToPosition: { x: 0, y: 0, z: 0 },
		teleportTo: false,
		teleportToPosition: { x: 0, y: 0, z: 0 },
		runTo: false,
		runToPosition: { x: 0, y: 0, z: 0 },
		setRotation: false,
		setRotationEulerAngles: { x: 0, y: 0, z: 0 },
		lookAtTarget: false,
		lookTargetPosition: { x: 0, y: 0, z: 0 },
		lookSpeed: "",
		stopLookAtTarget: false
	}
	return actorStateTemp;
}
  
function GetDummyChoice()
{
	var choice = {
		choiceText: "", 
		choiceOutcomeBranchId: -1
	}
	return choice;
}

function RemoveMessageFromBranch(branchId, messagePosition)
{
	var myBranch = GetBranch(branchId);

	var found = false;
	var i = 0;
	for(i = 0; i < messagePosition; i++)
	{
		if(myBranch.messages[i] != null)
		{
			found = true;
			break;
		}
	}
	if (i > -1 && found)  
	{
		myBranch.messages.splice(i, 1);
	}
}
  
function RemoveFromBranchesList(idToDelete)
{
	var found = false;
	var i = 0;
	for(i = 0; i < branchesList.length; i++)
	{
		if(branchesList[i].branchId == idToDelete)
		{
			found = true;
			break;
		}
	}

	if (i > -1 && found)  
	{
	  branchesList.splice(i, 1);
	}
}

  

//////////////////////////////////////////////////////////////////////////////
function MakeBox(numChoices, alreadyChosenBranchId) {
	var rect = new fabric.Rect({
	  originX: 'center',
	  originY: 'center',
	  fill: 'lightyellow',
	  width: 100,
	  height: 50,
	  objectCaching: false,
	  stroke: 'black',
	  strokeWidth: 2,
	  hasRotatingPoint: false,
	  selectable: false,
	});

	var thisID = -1;

	if(alreadyChosenBranchId != null)
	{
		thisID = alreadyChosenBranchId;
		if(alreadyChosenBranchId >= currNewId)
		{
			currNewId = alreadyChosenBranchId + 1;
		}
	}
	else
	{
		thisID = currNewId++;
	}

	AddToBranchesList(thisID, numChoices);

	var branchLabelStr = 'Branch: ' + thisID;

	var branchLabelText = new fabric.Text(branchLabelStr, {
	  fontSize: 11,
	  originX: 'center',
	  originY: 'center',
	  left: 0,
	  top: -10,
	  selectable: false,
	});
	
	
	var firstMessagePreviewText = new fabric.Text("", {
	  fontSize: 15,
	  originX: 'center',
	  originY: 'center',
	  left: 0,
	  top: 10,
	  selectable: false,
	});
	

	var group = new fabric.Group([ rect, branchLabelText, firstMessagePreviewText ], {
	  left: newBoxLeft,
	  top: newBoxTop,
	  originX: 'center',
	  originY: 'center'
	});
	group.setControlsVisibility({
		mt: false,
		mb: false,
		ml: false,
		mr: false,
		tl: false,
		tr: false,
		bl: false,
		br: false,
		mtr: false,
	});
	group.id = thisID;
	
	group.firstMessagePreviewText = firstMessagePreviewText;

	canvas.add(group);

	newBoxTop += 80;
	newBoxLeft += 80;
	if(newBoxTop > 600 || newBoxLeft > 600)
	{
		newBoxTop = 200;
		newBoxLeft = 200;
	}

	group.choiceCircles = [];

	//////////////////////////////////////////////////
	var leftOffset = -65;
	var topOffset = 15;
	var circleInput = makeCircle('lightblue',0, 0, leftOffset, topOffset, true, group, 'inputCircle');
	group.circleInput = circleInput;

	//Have to setCoords to make fabricjs happy
	circleInput.left = group.left + leftOffset;
	circleInput.top = group.top + topOffset;
	circleInput.setCoords();

	canvas.add(circleInput);
	//////////////////////////////////////////////////
	
	//////////////////////////////////////////////////
	var leftOffsetCopy = 0;
	var topOffsetCopy = -40;
	var buttonCopy = makeButton('yellow',0, 0, leftOffsetCopy, topOffsetCopy, false, group, 'copyButton', copyIcon, copyObject);
	group.buttonCopy = buttonCopy;

	//Have to setCoords to make fabricjs happy
	buttonCopy.left = group.left + leftOffsetCopy;
	buttonCopy.top = group.top + topOffsetCopy;
	buttonCopy.setCoords();

	canvas.add(buttonCopy);
	//////////////////////////////////////////////////
	
	//////////////////////////////////////////////////
	var leftOffsetEdit = -40;
	var topOffsetEdit = -40;
	var buttonEdit = makeButton('orange',0, 0, leftOffsetEdit, topOffsetEdit, false, group, 'editButton', editIcon, editObject);
	group.buttonEdit = buttonEdit;

	//Have to setCoords to make fabricjs happy
	buttonEdit.left = group.left + leftOffsetEdit;
	buttonEdit.top = group.top + topOffsetEdit;
	buttonEdit.setCoords();

	canvas.add(buttonEdit);
	//////////////////////////////////////////////////
	
	//////////////////////////////////////////////////
	var leftOffsetDelete = 40;
	var topOffsetDelete = -40;
	var buttonDelete = makeButton('red',0, 0, leftOffsetDelete, topOffsetDelete, false, group, 'deleteButton', deleteIcon, deleteObject);
	group.buttonDelete = buttonDelete;

	//Have to setCoords to make fabricjs happy
	buttonDelete.left = group.left + leftOffsetDelete;
	buttonDelete.top = group.top + topOffsetDelete;
	buttonDelete.setCoords();

	canvas.add(buttonDelete);
	//////////////////////////////////////////////////
	
	

	addOutputCircles(group, numChoices);

	canvas.renderAll();

	return group;
}
//////////////////////////////////////////////////////////////////////////////

function addOutputCircles(group, numChoices)
{
	if(numChoices > 0)
	{
		for(var i = 0; i < numChoices; i++)
		{
			leftOffset = 65;
			topOffset = 15 + (i * 25);
			
			var circleChoice = makeCircle('#caff9e', 0, 0, leftOffset, topOffset, false, group, 'choiceCircle' + i);
			group.choiceCircles.push(circleChoice);
			
			//Have to setCoords to make fabricjs happy
			circleChoice.left = group.left + leftOffset;
			circleChoice.top = group.top + topOffset;
			circleChoice.setCoords();
			
			canvas.add(circleChoice);
		}
		group.circleOutput = null;
	}
	else
	{
		leftOffset = 65;
		topOffset = 15;
		
		var circleOutput = makeCircle('lightgreen', 0, 0, leftOffset, topOffset, false, group, 'outputCircle');
		group.circleOutput = circleOutput;
		
		//Have to setCoords to make fabricjs happy
		circleOutput.left = group.left + leftOffset;
		circleOutput.top = group.top + topOffset;
		circleOutput.setCoords();
		
		canvas.add(circleOutput);
	}
}


  
//////////////////////////////////////////////////////////////////////////////
function makeLine(coords) {
	return new fabric.Line(coords, {
		stroke: 'black',
		strokeWidth: 2,
		selectable: false,
		evented: false,
	});
}
//////////////////////////////////////////////////////////////////////////////


function makeCircle(color, left, top, leftOffset, topOffset, isInput, groupRef, circleName) 
{
	var c = new fabric.Circle({
		left: left,
		top: top,
		strokeWidth: 2,
		radius: 10,
		fill: color,
		stroke: 'black',
		hoverCursor: 'pointer',
		selectable: false,
	});
	c.hasControls = c.hasBorders = false;
	c.isAConnectingCircle = true;
	c.isInput = isInput;
	c.targetingMe = [];
	c.groupRef = groupRef;
	c.leftOffset = leftOffset;
	c.topOffset = topOffset;
	c.circleName = circleName;
	
	c.destroyLink = (function()
	{
		if(this.isInput)
		{
			if(this.targetingMe && this.targetingMe.length > 0)
			{
				this.targetingMe.forEach(function(tar) 
				{
					canvas.remove(tar.connectingLine);
					tar.target = null;
					tar.connectingLine = null;
				});
			}
		}
		else
		{
			if(this.target)
			{
				var thisThingHere = this;
				
				var found = false;
				var i = 0;
				for(i = 0; i < this.target.targetingMe.length; i++)
				{
					if(this.target.targetingMe[i].groupRef.id == thisThingHere.groupRef.id)
					{
						if(this.target.targetingMe[i].circleName == thisThingHere.circleName)
						{
							found = true;
							break;
						}
						
					}
				}
				
				if (i > -1 && found)
				{
				
				  this.target.targetingMe.splice(i, 1);
				}
				
				canvas.remove(this.connectingLine);
				
				this.target = null;
				this.connectingLine = null;
			}
			
		}
		
		canvas.renderAll();
	});
	
	c.on('mousedown', function(options) 
	{
		//console.log('CIRCLE mousedown');
	});
	
	return c;
}
//////////////////////////////////////////////////////////////////////////////
function makeButton(color, left, top, leftOffset, topOffset, isInput, groupRef, buttonName, icon, clickFunction) 
{
	var c = new fabric.Image(icon, {
		left: left,
		top: top,
		strokeWidth: 2,
		hoverCursor: 'pointer',
		selectable: false,
		width:18,
		height:18
	});
	
	c.hasControls = c.hasBorders = false;
	c.groupRef = groupRef;
	c.leftOffset = leftOffset;
	c.topOffset = topOffset;
	c.buttonName = buttonName;
	
	c.on('mouseup', function(options) 
	{
		clickFunction(this.groupRef);
	});
	
	return c;
}
//////////////////////////////////////////////////////////////////////////////

//////////////////////////////////////////////////////////////////////////////
/*
function renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(deleteIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
	x: 0.4,
	y: -0.8,
	cursorStyle: 'pointer',
	mouseUpHandler: deleteObject,
	render: renderDeleteIcon,
	cornerSize: 22
});
 */
  
function deleteObject(thingToDelete) 
{
	var canvas = thingToDelete.canvas;
	
	RemoveFromBranchesList(thingToDelete.id);
	

	if(thingToDelete.circleOutput)
	{
		thingToDelete.circleOutput.destroyLink();
		canvas.remove(thingToDelete.circleOutput);
	}
	if(thingToDelete.circleInput)
	{
		thingToDelete.circleInput.destroyLink();
		canvas.remove(thingToDelete.circleInput);
	}
	
	if(thingToDelete.buttonCopy)
	{
		canvas.remove(thingToDelete.buttonCopy);
	}
	
	if(thingToDelete.buttonEdit)
	{
		canvas.remove(thingToDelete.buttonEdit);
	}
	
	if(thingToDelete.buttonDelete)
	{
		canvas.remove(thingToDelete.buttonDelete);
	}

	thingToDelete.choiceCircles.forEach(function(cir) 
	{
		cir.destroyLink();
		canvas.remove(cir);
	});

	canvas.remove(thingToDelete);

	canvas.renderAll();
}
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
/*
function renderCopyIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(copyIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.copyControl = new fabric.Control({
	x: 0,
	y: -0.8,
	cursorStyle: 'pointer',
	mouseUpHandler: copyObject,
	render: renderCopyIcon,
	cornerSize: 22
});
 */
 
function copyObject(thingToCopy) 
{
	var canvas = thingToCopy.canvas;
	
	var branch = GetBranch(thingToCopy.id);
	
	var box = MakeBox(branch.choices.length);

	box.top = thingToCopy.top + 80;
	box.left = thingToCopy.left + 80;
	box.setCoords();
	UpdateCirclePosition(box);
	
	var found = false;
	var i = 0;
	for(i = 0; i < branchesList.length; i++)
	{
		if(branchesList[i].branchId == box.id)
		{
			found = true;
			break;
		}
	}

	if (i > -1 && found) 
	{
		branchesList[i] = JSON.parse(JSON.stringify(branch));
		branchesList[i].branchId = box.id;
		
		
		var br = branchesList[i];
		
		if(br.messages.length > 0)
		{
			UpdateFirstMessagePreview(br.branchId,br.messages[0].messageText);
		}
		else
		{
			UpdateFirstMessagePreview(br.branchId,"");
		}	
		
	}
	

	canvas.renderAll();
}
//////////////////////////////////////////////////////////////////////////////


//////////////////////////////////////////////////////////////////////////////
/*
function renderEditIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(editIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.editControl = new fabric.Control({
	x: -0.4,
	y: -0.8,
	cursorStyle: 'pointer',
	mouseUpHandler: editObject,
	render: renderEditIcon,
	cornerSize: 22
});
 */
  
function editObject(thingToEdit) 
{
	var canvas = thingToEdit.canvas;
	
	var myBranch = GetBranch(thingToEdit.id);
	
	tempBranch =  JSON.parse(JSON.stringify(myBranch));
	
	
	renderMessageDetails(thingToEdit.id);
}
//////////////////////////////////////////////////////////////////////////////



canvas.on('object:moving', function(e) 
{
	var p = e.target;
	UpdateCirclePosition(p);
});

function UpdateCirclePosition(p)
{
	if(p.choiceCircles && p.choiceCircles.length > 0)
	{
		p.choiceCircles.forEach(function(cir) 
		{
			cir.left = p.left + cir.leftOffset;
			cir.top = p.top + cir.topOffset;
			cir.setCoords();
			
			if(cir.target)
			{
				cir.connectingLine.set({ 'x1': cir.left, 'y1': cir.top });
			}
			
		});
	}
	
	if(p.circleOutput)
	{
		
		p.circleOutput.left = p.left + p.circleOutput.leftOffset;
		p.circleOutput.top = p.top + p.circleOutput.topOffset;
		p.circleOutput.setCoords();
		
		
		if(p.circleOutput.target)
		{
			p.circleOutput.connectingLine.set({ 'x1': p.circleOutput.left, 'y1': p.circleOutput.top });
		}
	}
	
	if(p.circleInput)
	{
		
		p.circleInput.left = p.left + p.circleInput.leftOffset;
		p.circleInput.top = p.top + p.circleInput.topOffset;
		p.circleInput.setCoords();
		
		
		if(p.circleInput.targetingMe)
		{
			p.circleInput.targetingMe.forEach(function(tar) 
			{
				tar.connectingLine.set({ 'x2': p.circleInput.left, 'y2': p.circleInput.top });
			});

			//p.circleInput.targetingMe.connectingLine.set({ 'x2': p.circleInput.left, 'y2': p.circleInput.top });
		}
	}
	
	if(p.buttonCopy)
	{
		p.buttonCopy.left = p.left + p.buttonCopy.leftOffset;
		p.buttonCopy.top = p.top + p.buttonCopy.topOffset;
		p.buttonCopy.setCoords();
	}
	
	if(p.buttonEdit)
	{
		p.buttonEdit.left = p.left + p.buttonEdit.leftOffset;
		p.buttonEdit.top = p.top + p.buttonEdit.topOffset;
		p.buttonEdit.setCoords();
	}
	
	if(p.buttonDelete)
	{
		p.buttonDelete.left = p.left + p.buttonDelete.leftOffset;
		p.buttonDelete.top = p.top + p.buttonDelete.topOffset;
		p.buttonDelete.setCoords();
	}
	
	canvas.renderAll();
}


var spencerLine;
var isDrawingConnectingLine = false;

canvas.on('mouse:down', function(event)
{
	if(event.target == null)
	{
		dragFrom = null;
	}
	
	if(event.target != null && event.target.isAConnectingCircle && event.target.isInput == false)
	{
		isDrawingConnectingLine = true;
		var pointer = canvas.getPointer(event.e);
		var points = [event.target.left, event.target.top, pointer.x, pointer.y];

		spencerLine = new fabric.Line(points, {
			strokeWidth: 2,
			stroke: 'grey'
		});
		canvas.add(spencerLine);
		
		
		
		//===============================
		
		if(event.target.target)
		{
			event.target.destroyLink();
			dragFrom = event.target;
		}
		else
		{
			if(dragFrom)
			{
				//Do Nothing
			}
			else
			{
				dragFrom = event.target;
			}
		}
		//===============================
		
	}

});

//+++++++++++++++++++++++++++++++++++++++++



canvas.on('mouse:move', function (event) 
{
	if (isDrawingConnectingLine) 
	{
		var pointer = canvas.getPointer(event.e);
		spencerLine.set({ x2: pointer.x, y2: pointer.y });
		canvas.renderAll();
	}
});

canvas.on('mouse:up', function (event) 
{
	if(event.target != null && event.target.isAConnectingCircle && event.target.isInput == true)
	{
		//Connect The line
		//===============================
		if(dragFrom)
		{
			dragFrom.target = event.target;
			event.target.targetingMe.push(dragFrom);
			
			var line = makeLine([ dragFrom.left, dragFrom.top, event.target.left, event.target.top ]);
			canvas.add(line);
			
			dragFrom.connectingLine = line;
		}
		else
		{
			//
		}
		//===============================
	}
	
	dragFrom = null;
	
	canvas.remove(spencerLine);
	
	isDrawingConnectingLine = false;
	
	canvas.renderAll();
});

function AddLine(fromBranchID, fromChoice, toBranchId)
{
	var fromBox = GetBoxByBranchId(fromBranchID);
	var toBox = GetBoxByBranchId(toBranchId);
	
	if(toBox != null)
	{
		var fromCircle = null;
	
		var toCircle = toBox.circleInput;
		
		if(fromChoice >= 0)
		{
			fromCircle = fromBox.choiceCircles[fromChoice];
		}
		else
		{
			fromCircle = fromBox.circleOutput;
		}
		
		fromCircle.target = toCircle;
		toCircle.targetingMe.push(fromCircle);
		
		var line = makeLine([ fromCircle.left, fromCircle.top, toCircle.left, toCircle.top ]);
		canvas.add(line);
		
		fromCircle.connectingLine = line;
	}
}


function setCanvasSize() {
  //canvas.setWidth(window.innerWidth - (window.innerWidth*0.02));
  //canvas.setHeight(700);
  canvas.calcOffset();
}


//+++++++++++++++++++++++++++++++++++++++++
//Model Stuff

importExportBtn.onclick = function() 
{
	importExportModal.style.display = "block";
}

importExportModalCloseBtn.onclick = function() {
	importExportModal.style.display = "none";
	document.getElementById('jsonInputOutput').value = "";
}

variablesBtn.onclick = function()
{
	SetTempVariablesFromVariables();
	renderVariables();
	variablesModel.style.display = "block";
}


//+++++++++++++++++++++++++++++++++++++++++


////////////////////////////////////////////////////////////////////////
//START UP!
var rect1 = MakeBox(0);
setCanvasSize();
////////////////////////////////////////////////////////////////////////

