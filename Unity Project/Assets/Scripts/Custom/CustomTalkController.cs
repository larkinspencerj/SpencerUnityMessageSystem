using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.SceneManagement;

public class CustomTalkController : MonoBehaviour, ITalkController
{
	public GameObject messegePanel;
	private bool isTalking;

	public string JSONPath;

	public GameObject[] actorGameObjects;

	public GameObject[] cameras;

	public GameObject mainCamera;

	public List<AudioClip> voicesList;

	void Start () 
	{
		talk();
	}
	
	void Update () 
	{
		
	}

	public void talk()
	{
		if (!isTalking)
		{

			if (voicesList.Count > 0)
			{
				foreach (AudioClip a in voicesList)
				{
					messegePanel.GetComponent<PanelConfig>().addToVoicesList(a);
				}
			}
			else
			{
				Debug.Log("No Voice Clips");
			}

			mainCamera.SetActive(false);
			
			messegePanel.GetComponent<PanelConfig>().setActorGameObjects(actorGameObjects);
			messegePanel.GetComponent<PanelConfig>().setTalkController(this);
			messegePanel.GetComponent<PanelConfig>().setCameras(cameras);
				

			messegePanel.GetComponent<PanelManager>().StartEventFromJSONPath(JSONPath);
		}
	}

	public void finish()
	{
		mainCamera.SetActive(true);
		isTalking = false;
		Debug.Log("Finished");
	}

	public void setIsTalking(bool isTalking)
	{
		this.isTalking = isTalking;
	}

	public void setFlag(int flagNumber)
	{
		//Do Nothing
	}
}
