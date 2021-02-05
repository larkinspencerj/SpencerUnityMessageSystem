using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class ChoicePanel : MonoBehaviour
{

	public GameObject selectionOneIcon;
	public GameObject selectionTwoIcon;
	public GameObject selectionThreeIcon;
	public GameObject selectionFourIcon;

	public PanelConfig myPanelConfig;

	public AudioSource selectSound;
	public AudioSource moveSound;

	public int currentChoiceHighlighted;

	public bool canMakeChoice;

	public float currTime;
	private float makeChoiceTime = 0.5f;

	public bool movedUp;
	public bool movedDown;

	public bool useArrowKeys = false;

	private int numChoices = 4;

	// Use this for initialization
	void Start ()
	{
		reset();
	}
	
	// Update is called once per frame
	void Update ()
	{
		currTime += Time.deltaTime;

		if(currTime >= makeChoiceTime) //Prevent accidental skipping of choice by waiting before accepting choice
		{
			canMakeChoice = true;
		}
		else
		{
			canMakeChoice = false;
		}

		//timeSinceLastMove += Time.deltaTime;

		if (canMakeChoice)
		{
			if (useArrowKeys)
			{
				if (Input.GetButtonDown("Jump"))
				{
					Debug.Log("Choice Selected!");
					selectSound.Play();
					makeChoice();
				}
			}
		}

		if(useArrowKeys)
		{
			if (Input.GetButtonDown("Up"))
			{
				moveCursorUp();
			}
			if (Input.GetButtonDown("Down"))
			{
				moveCursorDown();
			}

			if (currentChoiceHighlighted == 1)
			{
				selectionOneIcon.SetActive(true);
			}
			else
			{
				selectionOneIcon.SetActive(false);
			}

			if (currentChoiceHighlighted == 2)
			{
				selectionTwoIcon.SetActive(true);
			}
			else
			{
				selectionTwoIcon.SetActive(false);
			}

			if (currentChoiceHighlighted == 3)
			{
				selectionThreeIcon.SetActive(true);
			}
			else
			{
				selectionThreeIcon.SetActive(false);
			}

			if (currentChoiceHighlighted == 4)
			{
				selectionFourIcon.SetActive(true);
			}
			else
			{
				selectionFourIcon.SetActive(false);
			}
		}
	}

	private void moveCursorUp()
	{
		moveSound.Play();
		currentChoiceHighlighted--;
		if (currentChoiceHighlighted < 1)
		{
			currentChoiceHighlighted = numChoices;
		}
		movedUp = true;
	}

	private void moveCursorDown()
	{
		moveSound.Play();
		currentChoiceHighlighted++;
		if (currentChoiceHighlighted > numChoices)
		{
			currentChoiceHighlighted = 1;
		}
		movedDown = true;
	}

	public void makeChoice()
	{
		canMakeChoice = false;
		myPanelConfig.makeChoice(currentChoiceHighlighted);
	}

	public void reset()
	{
		currTime = 0.0f;
		canMakeChoice = false;
		currentChoiceHighlighted = 1;
		selectionOneIcon.SetActive(false);
		selectionTwoIcon.SetActive(false);
		selectionThreeIcon.SetActive(false);
		selectionFourIcon.SetActive(false);
	}

}
