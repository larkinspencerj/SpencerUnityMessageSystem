using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using System;
using System.IO;

//list of JSON file with path extensions
//Only NarrativeManager should be able to use this script
//Take in scene number, output NarrativeEvent - Black Box
//Validation and exception handling

namespace JSONFactory
{
	class JSONAssembly
	{

		/*
		Examples of json path. Note the folder name and lack of .json
		"NPC1/NPC1_Event1"
		"NPC1/NPC1_Event2"
		"NPC2/NPC2_Event1"
		*/
		public static NarrativeEvent RunJSONFactoryForEvent(string eventJSONPath)
		{
			//Debug.Log("RunJSONFactoryForEvent()");
			string resourcePath = eventJSONPath;
			Debug.Log("resourcePath: " + (Application.streamingAssetsPath + "/" + resourcePath));

			try
			{
				TextAsset data = Resources.Load(resourcePath) as TextAsset;
				string jsonString = data.text;

				NarrativeEvent narrativeEvent = JsonUtility.FromJson<NarrativeEvent>(jsonString);

				//Debug.Log(JsonUtility.ToJson(narrativeEvent));

				Debug.Log ("JSON Seems to be OK");

				/*
				foreach(String s in narrativeEvent.variables.names)
				{
					Debug.Log(s);
				}
				foreach (String s in narrativeEvent.variables.faceEmotions)
				{
					Debug.Log(s);
				}
				foreach (String s in narrativeEvent.variables.animations)
				{
					Debug.Log(s);
				}
				foreach (String s in narrativeEvent.variables.cameraEffects)
				{
					Debug.Log(s);
				}
				foreach (String s in narrativeEvent.variables.SFX)
				{
					Debug.Log(s);
				}
				*/

				return narrativeEvent;
			}
			catch(Exception e)
			{
				Debug.Log ("I think the JSON is bad, please check it out.");
				Debug.Log (e);
			}
				

			NarrativeEvent errorEvent = new NarrativeEvent();

			errorEvent.branches = new Branch[1];
			errorEvent.branches[0] = new Branch();

			Message errorDialogue = new Message ();
			errorDialogue.name = 0;
			errorDialogue.messageText = "ERROR! JSON is probably invalid!";

			Debug.Log (errorDialogue.name);

			errorEvent.branches[0].messages = new Message[1];
			errorEvent.branches[0].messages [0] = errorDialogue;


			return errorEvent;
		}
			

	}
}