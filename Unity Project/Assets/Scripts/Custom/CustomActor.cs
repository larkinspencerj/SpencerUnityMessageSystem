using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CustomActor: MonoBehaviour, ICanTalk, IActor
{

	private float currentTalkTime = 0;
	private float talkTimeLimit = 0.09f;

	private bool isTalking = false;

	private bool isMouthOpen = false;

	public GameObject eyeL;
	public GameObject eyeR;
	public GameObject mouth;
	public GameObject eyebrows;

	public GameObject head;

	public Animator anim;

	private bool isWalking = false;

	private Vector3 walkTarget;

	private float walkSpeed = 1f;

	private HeadLookAt headLookAt;

	private float mouthClosedSizeZ = 0.0015f;

	

	// Use this for initialization
	void Start () 
	{
		headLookAt = this.GetComponent<HeadLookAt>();
	}
	
	// Update is called once per frame
	void Update () 
	{
		if (isTalking)
		{
			if (currentTalkTime >= talkTimeLimit)
			{
				toggleMouthOpen ();
				currentTalkTime = 0;
			}
			currentTalkTime += Time.deltaTime;


			float frequency = 20;
			float magnitude = 0.007f;
			float offset = 0f;
			float jawPos = (Mathf.Sin(Time.timeSinceLevelLoad * frequency) * magnitude) + offset;
			
			if (mouth)
				mouth.transform.localScale = new Vector3(mouth.transform.localScale.x, mouth.transform.localScale.y, jawPos);

		}

		ManageWalking();
	}

	private void ManageWalking()
	{
		if (isWalking)
		{
			if (Vector3.Distance(this.transform.position, walkTarget) <= 0.1f)
			{
				isWalking = false;
				anim.SetTrigger("Idle");
			}
			else
			{
				this.transform.LookAt(walkTarget);
				this.transform.eulerAngles = new Vector3(0, this.transform.eulerAngles.y, 0);
				this.transform.Translate(Vector3.forward * walkSpeed * Time.deltaTime);
			}
		}
	}

	public void toggleMouthOpen()
	{
		if (isMouthOpen)
		{
			isMouthOpen = false;
		}
		else
		{
			isMouthOpen = true;
		}
	}

	public void startTalking()
	{
		if (isTalking)
		{
			//Do Nothing if already talking
		}
		else
		{
			isTalking = true;
			currentTalkTime = 0;
			toggleMouthOpen ();
		}
	}

	public void stopTalking()
	{
		isTalking = false;
		//rend.materials [3].mainTexture = blankEyesTex;
		
		if (mouth)
			mouth.transform.localScale = new Vector3(mouth.transform.localScale.x, mouth.transform.localScale.y, mouthClosedSizeZ);
		currentTalkTime = 0;
	}


	public void Happy ()
	{
		Blank();
	}
	public void Sad()
	{
		Blank();
	}

	public void Angry()
	{
		Blank();
		eyebrows.SetActive(true);
	}

	public void Blank()
	{
		eyebrows.SetActive(false);
	}

	public void Blush()
	{
		Blank();
	}

	public void Wink()
	{
		Blank();
	}

	public void Worried()
	{
		Blank();
	}

	public void TeleportTo(Vector3 position)
	{
		this.transform.position = position;
	}

	public void WalkTo(Vector3 position)
	{
		anim.SetTrigger("Walk");
		isWalking = true;
		walkTarget = position;
		Debug.Log(walkTarget);
	}

	public void RunTo(Vector3 position)
	{
		//
	}

	public void LookAt(Vector3 position, float lookSpeed)
	{
		headLookAt.ikActive = true;
		
		headLookAt.lookTarget.setPositionToMoveTo(position, lookSpeed);
	}

	public void StopLookAt(float lookSpeed)
	{

		headLookAt.lookTarget.moveToDefaultPosition(lookSpeed);

	}

	public void SetRotation(Vector3 eulerAngles)
	{
		this.transform.eulerAngles = eulerAngles;
	}

	public void Animate(string animation)
	{
		anim.SetTrigger(animation);
	}

	public bool checkIfMoving()
	{
		if(isWalking)
		{
			return true;
		}
		else
		{
			return false;
		}
	}
}
