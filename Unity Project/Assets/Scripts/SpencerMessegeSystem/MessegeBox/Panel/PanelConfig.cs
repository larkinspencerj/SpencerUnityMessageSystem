﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;
using System;
using System.Text.RegularExpressions;

public class PanelConfig : MonoBehaviour
{
	private bool isActive;
	public Text characterNameText;
	public Text messegeText;
	public GameObject continueIcon;
	public GameObject choicesPanel;
	public GameObject textPanel;

	public AudioSource voice;
	public AudioSource selectionSound;
	public AudioSource selectionSound2;

	public List<AudioClip> voicesList;

	public SoundEffectsSystem soundEffectsSystem;

	private float currentTime = 0.0f;
	private float messegeSpeed = 0.02f;

	private PanelManager panelManager;
	public ChoicePanel choicePanelScript;

	private int currentIndex = 0;
	private string currentMessegeTextCopy;
	private int currentLetter = 0;

	private GameObject[] actorGameObjects;

	public Button[] optionButtons;

	private bool currentlyHaveOptions;

	private ITalkController myTalkController;

	public GameObject[] cameras;

	private bool atEndOfMessege;

	//private int currSpeakingActorNumber;

	private List<int> currSpeakingActorsList;

	private string currentSoundEffectAfterMessage;

	private string playerName;

	private Branch currentBranchCopy;
	private int stepIndexCopy;

	private bool waitingForTimer = false;

	private List<string> currChoicesTextCopy;

	public float debounceTime = 0f;

	void Start()
	{
		panelManager = this.GetComponent<PanelManager>();

		foreach (Button b in optionButtons)
		{
			b.gameObject.SetActive(false);
			b.enabled = false;
		}

		currChoicesTextCopy = new List<string>();
	}

	public void Configure(NarrativeEvent currentEvent, Branch currentBranch, int stepIndex)
	{
		if (currentBranch.messages.Length <= 0)
			return;

		var currentMessage = currentBranch.messages[stepIndex];

		if(currentMessage.flagNumber >= 0)
		{
			this.myTalkController.setFlag(currentMessage.flagNumber);
		}

		if (currentMessage.hideMessageBox)
		{
			textPanel.SetActive(false);
		}
		else
		{
			textPanel.SetActive(true);
		}

		if (currentMessage.advanceAfterXSeconds > 0)
		{
			atEndOfMessege = false;
			waitingForTimer = true;
			StartCoroutine("WaitForTimeThenAdvance", currentMessage.advanceAfterXSeconds);
		}

		currSpeakingActorsList = new List<int>();
		for(int i = 0; i < currentMessage.actorStates.Length; i++)
		{
			if(currentMessage.actorStates[i].isSpeaking)
			{
				currSpeakingActorsList.Add(currentMessage.actorStates[i].actorNumber);
			}
		}

		currentSoundEffectAfterMessage = currentEvent.variables.SFX[currentMessage.soundEffectAfterMessage];

		if (myTalkController != null)
		{
			myTalkController.setIsTalking(true);
		}

		atEndOfMessege = false;

		currentBranchCopy = currentBranch;
		stepIndexCopy = stepIndex;

		continueIcon.SetActive(false);

		checkActorStates(currentEvent, currentMessage);

		if (currentEvent.variables.SFX[currentMessage.soundEffectBeforeMessage] != null && currentEvent.variables.SFX[currentMessage.soundEffectBeforeMessage].Length > 0)
		{
			if(soundEffectsSystem)
			{
				soundEffectsSystem.playSoundEffect(currentEvent.variables.SFX[currentMessage.soundEffectBeforeMessage]);
			}
		}

		checkCurrCameraNum(currentMessage);

		checkCurrCameraEffect(currentMessage.cameraNum, currentEvent.variables.cameraEffects[currentMessage.cameraEffect]);

		if (currentBranch.choices != null && currentBranch.choices.Length > 0 && stepIndex == currentBranch.messages.Length -1)
		{
			this.currChoicesTextCopy = new List<string>();

			foreach (Choice currChoice in currentBranch.choices)
			{
				currChoicesTextCopy.Add(currChoice.choiceText);
			}

			currentlyHaveOptions = true;
		}
		else
		{
			currentlyHaveOptions = false;
		}

		if (currentEvent.variables.names[currentMessage.name] == "<playername>")
		{
			//Debug.Log("Name Contains <playername>!!!!!!!!");
			//Debug.Log(this.playerName);
			characterNameText.text = this.playerName;
		}
		else
		{
			//Debug.Log("normal name");
			//characterNameText.text = currentMessage.name;
			characterNameText.text = currentEvent.variables.names[currentMessage.name];
		}

		currentMessegeTextCopy = currentMessage.messageText;

		if (currentMessegeTextCopy.Contains("<playername>"))
		{
			//Debug.Log("Contains <playername>!!!!!!!!");
			currentMessegeTextCopy = currentMessegeTextCopy.Replace("<playername>", this.playerName);
			Debug.Log(currentMessegeTextCopy);
		}

		messegeText.text = "";
		currentLetter = 0;

		if (isActive)
		{
			currentIndex++;
		}
		else
		{
			messegeText.text = "";
		}
	}

	void Update()
	{
		bool peroid = false;
		bool comma = false;
		bool pause = false;
		bool willTalk = false;
		float pauseTime = 0.0f;
		currentTime += Time.deltaTime;

		if(debounceTime > 0)
			debounceTime -= Time.deltaTime;

		if (isActive)
		{

			if (Input.GetButtonDown("Jump") || Input.GetButtonDown("Fire1"))
			{
				if (atEndOfMessege && debounceTime > 0f)
				{
					//Do nothing
				}
				else
				{
					advance();
				}
					
			}

			if (currentTime >= messegeSpeed)
			{
				currentIndex++;
				if (atEndOfMessege)
				{
					//Do Nothing
				}
				else
				{
					if (currentLetter < currentMessegeTextCopy.Length)
					{
						if (!Char.IsWhiteSpace(currentMessegeTextCopy[currentLetter]))
						{
							willTalk = true;
						}

						if (currentMessegeTextCopy[currentLetter] == '.' || currentMessegeTextCopy[currentLetter] == '?' || currentMessegeTextCopy[currentLetter] == '!')
						{
							peroid = true;
							//Debug.Log("PUNCTUATION");
						}
						else if (currentMessegeTextCopy[currentLetter] == ',')
						{
							comma = true;
							//Debug.Log("PUNCTUATION");
						}

						if (currentMessegeTextCopy[currentLetter] == '<')
						{
							pause = true;
							//Debug.Log("Start of tag");

							int posOfCloseTag = currentMessegeTextCopy.IndexOf('>', currentLetter);

							if (currentMessegeTextCopy.Substring(currentLetter + 1, 5) == "pause") //Pause Tag
							{
								int posOfEquals = currentMessegeTextCopy.IndexOf('=', currentLetter);
								int length = posOfCloseTag - posOfEquals;
								String pauseTimeString = String.Empty;

								try
								{
									pauseTimeString = currentMessegeTextCopy.Substring(posOfEquals + 1, length - 1);
								}
								catch (Exception e)
								{
									Debug.Log("ERROR PARSING PAUSE TIME IN JSON TAG");
									Debug.Log(e);
								}

								pauseTime = float.Parse(pauseTimeString);


							}

							currentLetter = posOfCloseTag + 1;
							//Debug.Log(currentLetter);
							willTalk = false;
						}
						else
						{
							messegeText.text += currentMessegeTextCopy[currentLetter];
							currentLetter++;
						}

						if (willTalk)
						{
							
							if (!voice.isPlaying)
							{
								if (voicesList.Count > 0)
								{
									var ran = UnityEngine.Random.Range(0, voicesList.Count);
									voice.clip = voicesList[ran];
								}

								voice.Play();
							}

							foreach(int actorNum in currSpeakingActorsList)
							{
								actorGameObjects[actorNum].GetComponent<ICanTalk>().startTalking();
							}
							
						}


					}
					else
					{
						foreach (int actorNum in currSpeakingActorsList)
						{
							actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
						}

						FinishMessage();
					}
					if (pause)
					{
						currentTime = -pauseTime;
						pause = false;

						foreach (int actorNum in currSpeakingActorsList)
						{
							actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
						}
					}
					else if (peroid)
					{
						if(currentLetter == currentMessegeTextCopy.Length)
						{
							//Shorter pause on the last letter of the sentence
							currentTime = messegeSpeed;
						}
						else
						{
							currentTime = -0.5f;
						}
						
						peroid = false;
						/*
						if (actorGameObjects[currSpeakingActorNumber] != null)
						{
							actorGameObjects[currSpeakingActorNumber].GetComponent<ICanTalk>().stopTalking();
						}
						*/
						foreach (int actorNum in currSpeakingActorsList)
						{
							actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
						}
					}
					else if (comma)
					{
						if (currentLetter == currentMessegeTextCopy.Length)
						{
							//Shorter pause on the last letter of the sentence
							currentTime = messegeSpeed;
						}
						else
						{
							currentTime = -0.25f;
						}

						comma = false;
						/*
						if (actorGameObjects[currSpeakingActorNumber] != null)
						{
							actorGameObjects[currSpeakingActorNumber].GetComponent<ICanTalk>().stopTalking();
						}
						*/
						foreach (int actorNum in currSpeakingActorsList)
						{
							actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
						}
					}
					else
					{
						currentTime = 0.0f;
					}
				}

			}
		}

	}


	//This is called when the message is done
	public void clear()
	{
		isActive = false;
		characterNameText.text = "";
		messegeText.text = "";
		/*
		if (actorGameObjects[currSpeakingActorNumber] != null)
		{
			actorGameObjects[currSpeakingActorNumber].GetComponent<IActor>().Blank();
			actorGameObjects[currSpeakingActorNumber].GetComponent<ICanTalk>().stopTalking();
		}
		*/
		foreach (int actorNum in currSpeakingActorsList)
		{
			//actorGameObjects[actorNum].GetComponent<IActor>().Blank();
			actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
		}

		continueIcon.SetActive(false);

		if (myTalkController != null)
		{
			myTalkController.setIsTalking(false);
		}

		foreach (GameObject c in cameras)
		{
			c.SetActive(false);
		}

		voicesList = new List<AudioClip>();

		forceKillButtons();


		if (myTalkController != null)
		{
			myTalkController.finish();
		}
	}


	private void checkActorStates(NarrativeEvent currentEvent, Message currentMessage)
	{
		if(currentMessage.actorStates != null)
		{
			foreach(ActorState actorState in currentMessage.actorStates)
			{
				if(actorGameObjects[actorState.actorNumber] != null)
				{
					if(String.IsNullOrWhiteSpace(currentEvent.variables.faceEmotions[actorState.faceEmotion]) == false)
					{
						switch (currentEvent.variables.faceEmotions[actorState.faceEmotion])
						{
							case "Happy":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Happy();
								break;
							case "Sad":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Sad();
								break;
							case "Angry":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Angry();
								break;
							case "Blank":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Blank();
								break;
							case "Blush":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Blush();
								break;
							case "Wink":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Wink();
								break;
							case "Worried":
								actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Worried();
								break;
							default:
								Debug.Log("faceEmotion: " + actorState.faceEmotion + " not found. Check spelling / capitals");
								break;
						}
					}
					else
					{
						//Default to blank
						actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Blank();
					}
				}

				if (actorState.teleportTo)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().TeleportTo(actorState.teleportToPosition);

				if (actorState.walkTo)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().WalkTo(actorState.walkToPosition);

				if (actorState.runTo)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().RunTo(actorState.runToPosition);

				if (actorState.setRotation)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().SetRotation(actorState.setRotationEulerAngles);

				if (currentEvent.variables.animations[actorState.animation] != null && currentEvent.variables.animations[actorState.animation].Length > 0)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().Animate(currentEvent.variables.animations[actorState.animation]);

				if (actorState.lookAtTarget)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().LookAt(actorState.lookTargetPosition, actorState.lookSpeed);

				if (actorState.stopLookAtTarget)
					actorGameObjects[actorState.actorNumber].GetComponent<IActor>().StopLookAt(actorState.lookSpeed);
			}
		}
	}

	private void checkCurrCameraNum(Message currentMessage)
	{
		if (currentMessage.cameraNum >= 0 && currentMessage.cameraNum < cameras.Length)
		{
			foreach (GameObject c in cameras)
			{
				c.SetActive(false);
			}
			cameras[currentMessage.cameraNum].SetActive(true);
			cameras[currentMessage.cameraNum].GetComponent<CameraEffects>().setInitialPosition();
		}
		else if(currentMessage.cameraNum >= cameras.Length)
		{
			Debug.Log("<color=red>Error: </color> can't access camera: " + currentMessage.cameraNum + " It does not exsist. (remember cameras are zero index based)");
			throw new Exception("ERROR! can't access camera: " + currentMessage.cameraNum + " It does not exsist. (remember cameras are zero index based)");
		}
		else
		{
			Debug.Log("<color=red>Error: </color> currCameraNum is < 0");
			Debug.Log("<color=red>DEFAULTING currCamera TO ZERO!</color> ");
			currentMessage.cameraNum = 0;
			foreach (GameObject c in cameras)
			{
				c.SetActive(false);
			}
			cameras[0].SetActive(true);
		}
	}

	public void checkCurrCameraEffect(int currCamera, string cameraEffect)
	{
		if(currCamera >= cameras.Length)
		{
			Debug.Log("ERROR! can't access camera: " + currCamera + " It does not exsist. (remember cameras are zero index based)");
			throw new Exception("ERROR! can't access camera: " + currCamera + " It does not exsist. (remember cameras are zero index based)");
		}
		else
		{
			cameras[currCamera].GetComponent<CameraEffects>().lookAtTarget();
			if (cameraEffect == "followTarget")
			{
				cameras[currCamera].GetComponent<CameraEffects>().followTarget();
			}
			else if (cameraEffect == "shake")
			{
				cameras[currCamera].GetComponent<CameraEffects>().shake();
			}
			else if (cameraEffect == "zoomIn")
			{
				cameras[currCamera].GetComponent<CameraEffects>().zoomIn();
			}
			else if (cameraEffect == "zoomOut")
			{
				cameras[currCamera].GetComponent<CameraEffects>().zoomOut();
			}
			else if (cameraEffect == "fadeIn")
			{
				cameras[currCamera].GetComponent<CameraEffects>().fadeIn();
			}
			else if (cameraEffect == "fadeOut")
			{
				cameras[currCamera].GetComponent<CameraEffects>().fadeOut();
			}
			else if (cameraEffect == "fillWithColor")
			{
				cameras[currCamera].GetComponent<CameraEffects>().fillWithColor(); //Fill Camera with color
			}
			else if (cameraEffect == "stopFillWithColor")
			{
				cameras[currCamera].GetComponent<CameraEffects>().stopFillWithColor(); //Stop filling Camera with color
			}
			else if (cameraEffect == "pan")
			{
				cameras[currCamera].GetComponent<CameraEffects>().pan();
			}
			else
			{
				cameras[currCamera].GetComponent<CameraEffects>().reset();
			}
		}
		
	}


	public void makeChoice(int choice)
	{
		if (choice - 1 < currentBranchCopy.choices.Length)
		{
			int myChoice = currentBranchCopy.choices[choice - 1].choiceOutcomeBranchId;

			panelManager.StartEventFromBranchId(myChoice);

			hideChoiceButtons(choice - 1);
		}
		else
		{
			Debug.Log("ERROR, Invalid Choice!");
		}
	}

	public bool getCurrentlyHaveOptions()
	{
		return currentlyHaveOptions;
	}

	public void setActorGameObjects(GameObject[] actorGameObjects)
	{
		this.actorGameObjects = actorGameObjects;
	}

	public void setTalkController(ITalkController talkController)
	{
		this.myTalkController = talkController;
	}

	public void setVoiceAudioClip(AudioClip audioClip)
	{
		voice.clip = audioClip;
	}

	public void setVoicePitch(float pitch)
	{
		voice.pitch = pitch;
	}

	public void addToVoicesList(AudioClip inputClip)
	{
		if (voicesList == null)
		{
			voicesList = new List<AudioClip>();
		}
		voicesList.Add(inputClip);
	}

	public void setCameras(GameObject[] cameras)
	{
		this.cameras = new GameObject[cameras.Length];
		for (int i = 0; i < this.cameras.Length; i++)
		{
			this.cameras[i] = cameras[i];
		}
	}

	public void setPlayerName(String playerName)
	{
		this.playerName = playerName;
	}

	public void advance()
	{
		foreach (int actorNum in currSpeakingActorsList)
		{
			actorGameObjects[actorNum].GetComponent<ICanTalk>().stopTalking();
		}


		if (atEndOfMessege)
		{
			if(checkIfAnyActorsStillMoving() == false)
			{
				if (getCurrentlyHaveOptions() == false)
				{
					if (waitingForTimer == false)
					{
						atEndOfMessege = false;
						panelManager.UpdatePanelState();
						if (selectionSound.isActiveAndEnabled)
						{
							selectionSound.Play();
						}
					}
				}
			}
		}
		else
		{
			debounceTime = 0.2f;
			string pattern = @"<[^>]*>";
			string replacement = "";
			Regex rgx = new Regex(pattern);
			currentMessegeTextCopy = rgx.Replace(currentMessegeTextCopy, replacement);

			currentLetter = currentMessegeTextCopy.Length;
			messegeText.text = currentMessegeTextCopy;

			FinishMessage();
		}
	}

	public void FinishMessage()
	{
		if (atEndOfMessege == false)
		{
			if (checkIfAnyActorsStillMoving() == false)
			{
				continueIcon.SetActive(true);
				atEndOfMessege = true;

				if (stepIndexCopy == currentBranchCopy.messages.Length - 1)
				{
					if (currentBranchCopy.choices != null && currentBranchCopy.choices.Length > 0)
					{
						showChoiceButtons();
					}
				}

				if (currentSoundEffectAfterMessage != null && currentSoundEffectAfterMessage.Length > 0)
				{
					if (soundEffectsSystem)
					{
						soundEffectsSystem.playSoundEffect(currentSoundEffectAfterMessage);
					}
				}
			}
		}
		
	}

	private bool checkIfAnyActorsStillMoving()
	{
		foreach(GameObject g in actorGameObjects)
		{
			if (g.GetComponent<IActor>().checkIfMoving())
				return true;
		}
		return false;
	}

	#region choiceButtons

	private bool choiceButtonsShown = false;
	private float buttonFadeOutSpeed = 4;
	private float buttonFadeInSpeed = 8;

	public void showChoiceButtons()
	{
		if (currentBranchCopy.choices != null && currentBranchCopy.choices.Length > 0)
		{
			if (choiceButtonsShown == false)
			{

				StartCoroutine("fadeInChoiceButtons");

				continueIcon.SetActive(false);
				choicesPanel.SetActive(true);
				choicePanelScript.reset();

				for (int i = 0; i < currentBranchCopy.choices.Length; i++)
				{
					optionButtons[i].gameObject.SetActive(true);
				}

			}
			else
			{
				Debug.Log("Buttons still shown, wait and try again. " + currentMessegeTextCopy);
				continueIcon.SetActive(false);
				StartCoroutine("tryShowChoiceButtonsAgain");
			}
		}
		
	}

	IEnumerator tryShowChoiceButtonsAgain()
	{
		//Wait till the buttons are hidden to show new ones
		//To see this in action, put two choices right after eachother and lower the button fade speeds
		float waitTime = 0f;
		while (choiceButtonsShown == true)
		{
			waitTime += Time.deltaTime;
			yield return null;
		}

		showChoiceButtons();
	}

	IEnumerator fadeInChoiceButtons()
	{

		////////////////////
		//update text
		int optionIndex = 0;

		foreach (string s in currChoicesTextCopy)
		{
			optionButtons[optionIndex].GetComponentInChildren<Text>().text = s;
			optionIndex++;
		}
		////////////////////



		float alpha = 0;

		while (alpha < 1)
		{
			alpha += Time.deltaTime * buttonFadeInSpeed;

			foreach (Button b in optionButtons)
			{
				var img = b.GetComponent<Image>();
				img.color = new Color(img.color.r, img.color.g, img.color.b, alpha);

				foreach (Transform child in b.gameObject.transform)
				{
					var text = child.GetComponent<Text>();

					if (text)
					{
						text.color = new Color(text.color.r, text.color.g, text.color.b, alpha);
					}
				}

			}

			yield return null;
		}

		foreach (Button b in optionButtons)
		{
			b.enabled = true;
		}

		choiceButtonsShown = true;
	}

	public void hideChoiceButtons(int lastChoice)
	{
		if (choiceButtonsShown)
		{
			StartCoroutine("fadeOutChoiceButtons", lastChoice);
		}
	}

	IEnumerator fadeOutChoiceButtons(int lastChoice)
	{
		foreach (Button b in optionButtons)
		{
			b.enabled = false;
		}

		float alpha = 1;

		while(alpha > 0)
		{
			alpha -= Time.deltaTime * buttonFadeOutSpeed;

			for(int i = 0; i < optionButtons.Length; i++)
			{
				if(i != lastChoice)
				{
					setButtonAlpha(optionButtons[i], alpha); //First fade not selected choice
				}
			}

			yield return null;
		}

		yield return new WaitForSeconds(0.4f);
		
		alpha = 1;

		while (alpha > 0)
		{
			alpha -= Time.deltaTime * buttonFadeOutSpeed;

			setButtonAlpha(optionButtons[lastChoice], alpha); //Then fade the selected choice

			yield return null;
		}
		

		choicesPanel.SetActive(false);
		foreach (Button b in optionButtons)
		{
			b.gameObject.SetActive(false);
		}

		choiceButtonsShown = false;
	}

	private void setButtonAlpha(Button b, float alpha)
	{
		var img = b.GetComponent<Image>();
		img.color = new Color(img.color.r, img.color.g, img.color.b, alpha);

		foreach (Transform child in b.gameObject.transform)
		{
			var text = child.GetComponent<Text>();

			if (text)
			{
				text.color = new Color(text.color.r, text.color.g, text.color.b, alpha);
			}
		}
	}

	private void forceKillButtons()
	{
		for (int i = 0; i < optionButtons.Length; i++)
		{
			setButtonAlpha(optionButtons[i], 0); //First fade not selected choice
		}

		foreach (Button b in optionButtons)
		{
			b.gameObject.SetActive(false);
		}

		choiceButtonsShown = false;
	}

	#endregion

	public bool getIsActive()
	{
		return isActive;
	}

	public void setIsActive(bool active)
	{
		this.isActive = active;
	}

	IEnumerator WaitForTimeThenAdvance(float waitTime)
	{
		Debug.Log("START WAITING: " + waitTime);
		yield return new WaitForSeconds(waitTime);
		Debug.Log("STOP WAITING");
		atEndOfMessege = true;
		waitingForTimer = false;
		advance();
	}
}

