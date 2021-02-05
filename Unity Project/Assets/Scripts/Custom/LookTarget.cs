using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class LookTarget : MonoBehaviour
{
    private Vector3 moveToPosition;
    private float moveToSpeed;
    private bool movingToPosition;
    private Transform defaultPosition;

    private bool movingToDefaultPosition;

    private HeadLookAt headLookAt;

    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        if(movingToPosition)
		{
            if(Vector3.Distance(this.transform.position, moveToPosition) > 0.1f)
		    {
                float step = moveToSpeed * Time.deltaTime;
                this.transform.position = Vector3.MoveTowards(transform.position, moveToPosition, step);
            }
            else
			{
                movingToPosition = false;
            }
		}
        else if(movingToDefaultPosition)
		{
            if (Vector3.Distance(this.transform.position, moveToPosition) > 0.01f)
            {
                float step = moveToSpeed * Time.deltaTime;
                this.transform.position = Vector3.MoveTowards(transform.position, moveToPosition, step);
            }
            else
            {
                movingToDefaultPosition = false;
                headLookAt.FinishedMovingToDefaultPosition();
            }
        }
        else if(headLookAt.ikActive == false)
		{
            this.transform.position = defaultPosition.position;
		}
    }

    public void setDefaultPosition(Transform defaultPosition)
	{
        this.defaultPosition = defaultPosition;
        this.transform.position = defaultPosition.position;
    }

    public void setHeadLookAt(HeadLookAt headLookAt)
	{
        this.headLookAt = headLookAt;
    }

    public void setPositionToMoveTo(Vector3 moveToPosition, float moveToSpeed)
	{
        if(moveToSpeed > 0.1f)
		{
            movingToPosition = true;
            this.moveToPosition = moveToPosition;
            this.moveToSpeed = moveToSpeed;
        }
        else
		{
            this.transform.position = moveToPosition;
        }
    }

    public void moveToDefaultPosition(float moveToSpeed)
	{
        if (moveToSpeed > 0.1f)
        {
            movingToDefaultPosition = true;
            this.moveToPosition = defaultPosition.position;
            this.moveToSpeed = moveToSpeed;
        }
        else
        {
            this.transform.position = defaultPosition.position;
            headLookAt.FinishedMovingToDefaultPosition();
        }
    }

}
