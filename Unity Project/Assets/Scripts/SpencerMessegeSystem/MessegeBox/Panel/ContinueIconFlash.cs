using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class ContinueIconFlash : MonoBehaviour
{
	public float frequency;
	public float magnitude;
	public float offset;

	private Image image;

	public float alpha = 0f;

	// Use this for initialization
	void Start()
	{
		image = this.GetComponent<Image>();

		alpha = (Mathf.Cos(Time.unscaledTime * frequency) * magnitude) + offset;

		image.color = new Color(255, 255, 255, alpha);
	}

	// Update is called once per frame
	void Update()
	{
		alpha = (Mathf.Cos(Time.unscaledTime * frequency) * magnitude) + offset;

		image.color = new Color(255, 255, 255, alpha);
	}
}
