var dragFrom;
var dragTo;
var currNewId = 0;

var newBoxTop = 100;
var newBoxLeft = 100;

var canvas = this.__canvas = new fabric.Canvas('c');
canvas.selection = false;
fabric.Object.prototype.originX = fabric.Object.prototype.originY = 'center';

var deleteIcon = document.createElement('img');
deleteIcon.src = "data:image/svg+xml,%3C%3Fxml version='1.0' encoding='utf-8'%3F%3E%3C!DOCTYPE svg PUBLIC '-//W3C//DTD SVG 1.1//EN' 'http://www.w3.org/Graphics/SVG/1.1/DTD/svg11.dtd'%3E%3Csvg version='1.1' id='Ebene_1' xmlns='http://www.w3.org/2000/svg' xmlns:xlink='http://www.w3.org/1999/xlink' x='0px' y='0px' width='595.275px' height='595.275px' viewBox='200 215 230 470' xml:space='preserve'%3E%3Ccircle style='fill:%23F44336;' cx='299.76' cy='439.067' r='218.516'/%3E%3Cg%3E%3Crect x='267.162' y='307.978' transform='matrix(0.7071 -0.7071 0.7071 0.7071 -222.6202 340.6915)' style='fill:white;' width='65.545' height='262.18'/%3E%3Crect x='266.988' y='308.153' transform='matrix(0.7071 0.7071 -0.7071 0.7071 398.3889 -83.3116)' style='fill:white;' width='65.544' height='262.179'/%3E%3C/g%3E%3C/svg%3E";

var editIcon = document.createElement('img');
editIcon.src = './icons/edit_icon.png';

var copyIcon = document.createElement('img');
copyIcon.src = './icons/copy_icon.png';

var branchesList = [];

fabric.Object.prototype.transparentCorners = false;
fabric.Object.prototype.cornerColor = 'blue';
fabric.Object.prototype.cornerStyle = 'circle';

var tempBranch = null;

//Modal Stuff
var importExportModal = document.getElementById("importExportModal");
var importExportBtn = document.getElementById("importExportBtn");
var closeBtn = document.getElementsByClassName("close")[0];


function ImportJson()
{
	try 
	{
		var jsonString = document.getElementById('jsonInputOutput').value;
		jsonObj = JSON.parse(jsonString);
		
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
	
	console.log(canvas._objects);
	console.log(branchesList);
	console.log(tempBranch);
	
	var jsonObj  = { branches:branchesList }
	var jsonString = JSON.stringify(jsonObj)
	
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



function renderMessageDetails(branchId)
{
	var editBranchInfoHTML = [];
	
	editBranchInfoHTML.push("<h1>Editing Branch: " + branchId + "</h1>");
	editBranchInfoHTML.push("<br>");
	var myBranch = GetBranch(branchId);
	
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
		editBranchInfoHTML.push("<input type='text' id='messageName" + i + "' value='" + tempBranch.messages[i].name  + "'><br><br>");
		
		editBranchInfoHTML.push("<label>Message Text:</label>");
		editBranchInfoHTML.push("<textarea type='text' id='messageText" + i + "' class='messageText' spellcheck='true'>" + tempBranch.messages[i].messageText + "</textarea><br><br>");
		
		///
		editBranchInfoHTML.push("<div class='spencerrow'>");
			
		editBranchInfoHTML.push("<div class='spencercolumn'>");
		editBranchInfoHTML.push("<label>Camera Num:</label>");
		editBranchInfoHTML.push("<input type='text' id='cameraNum" + i + "' value='" + tempBranch.messages[i].cameraNum  + "' class='smallInput'><br><br>");
		editBranchInfoHTML.push("<label>SFX Before Message:</label>");
		editBranchInfoHTML.push("<input type='text' id='soundEffectBeforeMessage" + i + "' value='" + tempBranch.messages[i].soundEffectBeforeMessage + "'><br><br>");
		
		editBranchInfoHTML.push("<label>Flag Number:</label>");
		editBranchInfoHTML.push("<input type='text' id='flagNumber" + i + "' value='" + tempBranch.messages[i].flagNumber + "'><br><br>");
		
		editBranchInfoHTML.push("<label>Advance After X Seconds:</label>");
		editBranchInfoHTML.push("<input type='text' id='advanceAfterXSeconds" + i + "' value='" + tempBranch.messages[i].advanceAfterXSeconds + "'>");
		
		editBranchInfoHTML.push("</div>");
		
		editBranchInfoHTML.push("<div class='spencercolumn'>");
		editBranchInfoHTML.push("<label>Camera Effect:</label>");
		editBranchInfoHTML.push("<input type='text' id='cameraEffect" + i + "' value='" + tempBranch.messages[i].cameraEffect + "'><br><br>");
		
		editBranchInfoHTML.push("<label>SFX After Message:</label>");
		editBranchInfoHTML.push("<input type='text' id='soundEffectAfterMessage" + i + "' value='" + tempBranch.messages[i].soundEffectAfterMessage + "'><br><br>");
		
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
			editBranchInfoHTML.push("<input type='text' id='faceEmotion" + i + "_" + j + "' value='" + thisActorState.faceEmotion + "'><br><br>");
			
			
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
			editBranchInfoHTML.push("<input type='text' id='animation" + i + "_" + j + "' value='" + thisActorState.animation + "'><br><br>");
			
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
	
	
	
	
	//////////////////////////////////////////////////////////
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
	editBranchInfoHTML.push("<label>(changing number of choices will break links)</label><br><br>");
	//////////////////////////////////////////////////////////

	editBranchInfoHTML.push("<button id='saveBranch' onclick='SaveBranch(" + branchId + ")' class='saveButton'>Save</button>");
	
	editBranchInfoHTML.push("<button id='cancelEditBracnh' onclick='CancelEditBranch(" + branchId + ")'>Cancel</button>");
	
	
	editBranchInfoHTML = editBranchInfoHTML.join("");
	
	document.getElementById("detailsSpace").innerHTML = editBranchInfoHTML;
	document.getElementById("detailsSpace").style.display = "block";
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
	  fontSize: 15,
	  originX: 'center',
	  originY: 'center',
	  left: 0,
	  top: -10,
	  selectable: false,
	});
	
	
	var firstMessagePreviewText = new fabric.Text("", {
	  fontSize: 11,
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

	newBoxTop += 10;
	newBoxLeft += 10;
	if(newBoxTop > 600 || newBoxLeft > 600)
	{
		newBoxTop = 200;
		newBoxLeft = 200;
	}

	group.choiceCircles = [];

	var leftOffset = -65;
	var topOffset = 15;
	var circleInput = makeCircle('lightblue',0, 0, leftOffset, topOffset, true, group, 'inputCircle');
	group.circleInput = circleInput;

	//Have to setCoords to make fabricjs happy
	circleInput.left = group.left + leftOffset;
	circleInput.top = group.top + topOffset;
	circleInput.setCoords();

	canvas.add(circleInput);

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


//////////////////////////////////////////////////////////////////////////////
function renderDeleteIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(deleteIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.deleteControl = new fabric.Control({
	x: 0.7,
	y: -0.9,
	offsetY: 16,
	cursorStyle: 'pointer',
	mouseUpHandler: deleteObject,
	render: renderDeleteIcon,
	cornerSize: 24
});
  
  
function deleteObject(eventData, thingToDelete) 
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
function renderCopyIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(copyIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.copyControl = new fabric.Control({
	x: 1,
	y: -1.5,
	offsetY: 16,
	cursorStyle: 'pointer',
	mouseUpHandler: copyObject,
	render: renderCopyIcon,
	cornerSize: 24
});
  
 
function copyObject(eventData, thingToCopy) 
{
	var canvas = thingToCopy.canvas;
	
	
	var branch = GetBranch(thingToCopy.id);
	
	var box = MakeBox(branch.choices.length);

	box.top = thingToCopy.top + 50;
	box.left = thingToCopy.left + 50;
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
function renderEditIcon(ctx, left, top, styleOverride, fabricObject) {
	var size = this.cornerSize;
	ctx.save();
	ctx.translate(left, top);
	ctx.rotate(fabric.util.degreesToRadians(fabricObject.angle));
	ctx.drawImage(editIcon, -size/2, -size/2, size, size);
	ctx.restore();
}

fabric.Object.prototype.controls.editControl = new fabric.Control({
	x: 0.7,
	y: -1.5,
	offsetY: 16,
	cursorStyle: 'pointer',
	mouseUpHandler: editObject,
	render: renderEditIcon,
	cornerSize: 24
});
  
  
function editObject(eventData, thingToEdit) 
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

closeBtn.onclick = function() {
  importExportModal.style.display = "none";
  document.getElementById('jsonInputOutput').value = "";
}

//+++++++++++++++++++++++++++++++++++++++++


////////////////////////////////////////////////////////////////////////
//START UP!
var rect1 = MakeBox(0);
setCanvasSize();
////////////////////////////////////////////////////////////////////////

