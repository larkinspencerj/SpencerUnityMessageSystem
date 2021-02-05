using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class Message
{
	public string name;
	public string messageText;
	public int cameraNum;
	public string cameraEffect;
	public string soundEffectBeforeMessage;
	public string soundEffectAfterMessage;
	public ActorState[] actorStates;
	public int flagNumber;

	public bool hideMessageBox;
	public float advanceAfterXSeconds;
}