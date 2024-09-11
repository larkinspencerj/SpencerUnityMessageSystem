using System;
using System.Collections.Generic;
using UnityEngine;

[Serializable]
public class Message
{
	public int name;
	public string messageText;
	public int cameraNum;
	public int cameraEffect;
	public int soundEffectBeforeMessage;
	public int soundEffectAfterMessage;
	public ActorState[] actorStates;
	public int flagNumber;

	public bool hideMessageBox;
	public float advanceAfterXSeconds;
}