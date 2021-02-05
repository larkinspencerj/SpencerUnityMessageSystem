using System;
using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class SoundEffectsSystem : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }

	public void playSoundEffect(string soundEffect)
	{
		try
		{
			var sfx = this.transform.Find(soundEffect).gameObject;
			sfx.GetComponent<AudioSource>().Play();
		}
		catch(Exception)
		{
			Debug.Log("<color=red>Error: </color>Sound effect not found: " + soundEffect);
		}
	}
}
