using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class CameraEffects : MonoBehaviour
{

	public GameObject target;

	private bool followTargetBool;
	private bool shakeBool;
	public bool zoomInBool;
	public bool zoomOutBool;
	public bool panBool;

	private bool isShaking;
	public float initialShakeTime = 0.3f;
	public float initialShakeIntensity = 1.0f;
	private float currShakeTime;


	public float initialZoomIntensity = 10.0f;
	public float initialZoomTime = 0.5f;

	public bool isZoomingIn;
	public bool isZoomingOut;
	public float currZoomTime;

	private Vector3 originalPosition;
	private Vector3 originalRotation;
	private bool originalPosistionSet = false;

	public Texture2D fadeOutTexture;
	private float fadeSpeed = 0.5f;
	private int drawDepth = -1000;
	private float alpha = 1.0f;
	public int fadeDir = 0;

	public Vector3 panTarget;
	public float panSpeed = 0f;

	private float initalFOV;

	public float fovOverride;

	// Use this for initialization
	void Start ()
	{
		currShakeTime = initialShakeTime;
		currZoomTime = initialZoomTime;
		initalFOV = this.GetComponent<Camera>().fieldOfView;

		if (fovOverride > 0)
		{
			initalFOV = fovOverride;
			//Debug.Log("OVERRIDE");
		}

		//Debug.Log("9999999999999999999999999999");
		//Debug.Log("initalFOV: " + initalFOV);
		//Debug.Log("9999999999999999999999999999");
	}
	
	// Update is called once per frame
	void Update ()
	{
		if(followTargetBool)
		{
			if (target != null)
			{
				this.transform.LookAt(target.transform.position);
			}
		}
		else if(shakeBool)
		{
			if (isShaking)
			{
				currShakeTime -= Time.deltaTime;
				if (currShakeTime <= 0.0f)
				{
					isShaking = false;
				}
				this.transform.localPosition = originalPosition + Random.insideUnitSphere * (currShakeTime);
			}
			else
			{
				this.transform.localPosition = originalPosition;
				shakeBool = false;
				reset();
			}
			
		}
		else if(zoomInBool)
		{
			if (isZoomingIn)
			{
				currZoomTime -= Time.deltaTime;
				if (currZoomTime <= 0.0f)
				{
					isZoomingIn = false;
				}
				this.GetComponent<Camera>().fieldOfView = initalFOV + (currZoomTime * initialZoomIntensity);
			}
			else
			{
				zoomInBool = false;
				this.GetComponent<Camera>().fieldOfView = initalFOV;
			}
		}
		else if(zoomOutBool)
		{
			if (isZoomingOut)
			{
				currZoomTime -= Time.deltaTime;
				if (currZoomTime <= 0.0f)
				{
					isZoomingOut = false;
				}
				this.GetComponent<Camera>().fieldOfView = initalFOV - (currZoomTime * initialZoomIntensity);
			}
			else
			{
				zoomOutBool = false;
				this.GetComponent<Camera>().fieldOfView = initalFOV;
			}
		}
		else if(panBool)
		{
			float step = panSpeed * Time.deltaTime;
			Vector3 newDir = Vector3.RotateTowards(transform.forward, panTarget, step, 0.0f);
			transform.rotation = Quaternion.LookRotation(newDir);
		}
	}



	public void followTarget()
	{
		reset();
		followTargetBool = true;
	}

	public void shake()
	{
		reset();
		shakeBool = true;
		isShaking = true;
	}

	public void zoomIn()
	{
		reset();
		zoomInBool = true;
		isZoomingIn = true;
		this.GetComponent<Camera>().fieldOfView = initalFOV - (currZoomTime * initialZoomIntensity);
	}

	public void zoomOut()
	{
		reset();
		zoomOutBool = true;
		isZoomingOut = true;
		this.GetComponent<Camera>().fieldOfView = initalFOV - (currZoomTime * initialZoomIntensity);
	}

	public void pan()
	{
		reset();
		panBool = true;
		this.panTarget =  new Vector3(this.transform.rotation.x, this.transform.rotation.y, this.transform.rotation.z + 90);
		this.panSpeed = 0.1f;
	}

	public void reset()
	{
		followTargetBool = false;
		shakeBool = false;
		zoomInBool = false;
		zoomOutBool = false;
		panBool = false;

		currShakeTime = initialShakeTime;
		currZoomTime = initialZoomTime;

		isShaking = false;
		isZoomingOut = false;
		isZoomingIn = false;

		this.transform.eulerAngles = originalRotation;
		this.transform.localPosition = originalPosition;
		if(initalFOV > 0)
			this.GetComponent<Camera>().fieldOfView = initalFOV;
	}

	public void setInitialPosition()
	{
		if(!originalPosistionSet)
		{
			originalRotation = this.transform.eulerAngles;
			originalPosition = this.transform.localPosition;
			originalPosistionSet = true;
			currShakeTime = initialShakeTime;

			currZoomTime = initialZoomTime;
		}
		
	}

	public void lookAtTarget()
	{
		if(target != null)
		{
			this.transform.LookAt(target.transform.position);
		}
	}

	void OnGUI()
	{
		if(fadeDir != 0)
		{
			alpha += fadeDir * fadeSpeed * Time.deltaTime;
			alpha = Mathf.Clamp01(alpha);

			GUI.color = new Color(GUI.color.r, GUI.color.g, GUI.color.b, alpha);
			GUI.depth = drawDepth;
			GUI.DrawTexture(new Rect(0, 0, Screen.width, Screen.height), fadeOutTexture);
		}
	}

	public float BeginFade(int direction)
	{
		fadeDir = direction;
		return (fadeSpeed);
	}

	public void fadeIn()
	{
		alpha = 1.0f;
		fadeSpeed = 1.0f;
		BeginFade(-1);
	}

	public void fadeOut()
	{
		alpha = 0.0f;
		fadeSpeed = 1.0f;
		BeginFade(1);
	}
}
