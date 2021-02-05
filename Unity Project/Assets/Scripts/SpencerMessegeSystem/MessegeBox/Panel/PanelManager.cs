using System.Collections;
using System.Collections.Generic;
using UnityEngine;
using JSONFactory;

public class PanelManager : MonoBehaviour
{
	private string eventJSONPath;

	private PanelConfig messegePanel;

	private int branchId;

	private NarrativeEvent currentEvent;

	private int stepIndex;

	public GameObject[] otherUI; //Add other UI here if you want to hide it

	private bool isDone;

	void Start()
	{
		messegePanel = this.GetComponent<PanelConfig> ();
	}

	void Awake()
	{
		//
	}


	public void StartEventFromJSONPath(string eventJSONPath)
	{
		this.eventJSONPath = eventJSONPath;

		stepIndex = 0;

		branchId = 0;

		currentEvent = JSONAssembly.RunJSONFactoryForEvent(eventJSONPath);

		InitializePanels();
		isDone = false;
	}

	public void StartEventFromBranchId(int branchId)
	{
		stepIndex = 0;

		this.branchId = branchId;

		InitializePanels();
		isDone = false;
	}


	void Update()
	{
		//Nothing here
	}

	private void InitializePanels()
	{
		showPanel ();
		messegePanel = this.GetComponent<PanelConfig> ();
		messegePanel.setIsActive(true);

		Branch currBranch = getBranchByBranchID(currentEvent.branches, branchId);

		messegePanel.Configure(currBranch, stepIndex);

		stepIndex++;
	}


	private void ConfigurePanels()
	{
		messegePanel.setIsActive(true);
		Branch currBranch = getBranchByBranchID(currentEvent.branches, branchId);
		messegePanel.Configure(currBranch, stepIndex);
	}

	public void UpdatePanelState()
	{
		if (currentEvent != null)
		{
			if (messegePanel.getCurrentlyHaveOptions () == false)
			{
				//Debug.Log ("Currently DO NOT Have Options");
				if (stepIndex < getBranchByBranchID(currentEvent.branches, branchId).messages.Length)
				{
					ConfigurePanels ();
					stepIndex++;
				}
				else
				{
					if(getBranchByBranchID(currentEvent.branches, branchId).nextBranchId > 0)
					{
						//Go to that branch
						StartEventFromBranchId(getBranchByBranchID(currentEvent.branches, branchId).nextBranchId);
					}
					else
					{
						hidePanel();
						messegePanel.clear();
						isDone = true;
					}
				}
			}
			else
			{
				//Debug.Log ("Currently Have Options, pick one");
			}
		}
	}

	public void showPanel()
	{
		this.gameObject.SetActive (true);
		foreach (GameObject uiItem in otherUI)
		{
			uiItem.SetActive (false);
		}
	}

	public void hidePanel()
	{
		this.gameObject.SetActive (false);
		foreach (GameObject uiItem in otherUI)
		{
			uiItem.SetActive (true);
		}
	}

	public Branch getBranchByBranchID(Branch[] branchList, int branchID)
	{
		foreach(Branch b in branchList)
		{
			if(b.branchId == branchId)
			{
				return b;
			}
		}
		return null;
	}

}
