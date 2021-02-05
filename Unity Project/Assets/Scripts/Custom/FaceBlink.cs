using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class FaceBlink : MonoBehaviour
{
	public GameObject eyeL;
	public GameObject eyeR;

	private Renderer eyeLRend;
	private Renderer eyeRRend;

	public Material eyeOpen;
	public Material eyeClosed;

	// Start is called before the first frame update
	void Start()
    {
		eyeLRend = eyeL.GetComponent<Renderer>();
		eyeRRend = eyeR.GetComponent<Renderer>();


		StartCoroutine("blink");
	}

    // Update is called once per frame
    void Update()
    {
		
	}

	
	IEnumerator blink()
	{
		while(true)
		{
			yield return new WaitForSeconds(Random.Range(1f,5f));

			eyeLRend.material = eyeClosed;
			eyeRRend.material = eyeClosed;

			yield return new WaitForSeconds(0.1f);

			eyeLRend.material = eyeOpen;
			eyeRRend.material = eyeOpen;
		}
	}


}
