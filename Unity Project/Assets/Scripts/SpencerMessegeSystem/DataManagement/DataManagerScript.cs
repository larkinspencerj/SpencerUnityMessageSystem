﻿using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using UnityEngine.UI;

public class DataManagerScript : MonoBehaviour 
{

	public int currentDay;
	public int currentMoney;
	public int currentScore;

	public Text dayText;
	public Text moneyText;
	public Text loveText;

	// Use this for initialization
	void Start () 
	{
		
	}
	
	// Update is called once per frame
	void Update () 
	{
		dayText.text = "Day: " + currentDay;
		moneyText.text = "Money: $" + currentMoney;
		loveText.text = "Score: " + currentScore;
	}


	public int getCurrentDay()
	{
		return currentDay;
	}


	public int getCurrentMoney()
	{
		return currentMoney;
	}

	public int getCurrentScore()
	{
		return currentScore;
	}

	public void addToCurrentScore(int input)
	{
		currentScore += input;
	}

}
