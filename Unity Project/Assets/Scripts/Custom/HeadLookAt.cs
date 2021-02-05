using UnityEngine;
using System;
using System.Collections;

[RequireComponent(typeof(Animator))]

public class HeadLookAt : MonoBehaviour
{

    protected Animator animator;
    public bool ikActive = false;
    public LookTarget lookTarget;
    public Transform defaultLookTargetPosition;

    void Start()
    {
        animator = GetComponent<Animator>();

        var face = this.GetComponent<CustomActor>().head;
        defaultLookTargetPosition.position = face.transform.position + face.transform.forward + new Vector3(0,0.1f,0);

        lookTarget.setDefaultPosition(defaultLookTargetPosition);
        lookTarget.setHeadLookAt(this);
    }

    public LookTarget getLookTarget()
	{
        return lookTarget;
    }

    public void FinishedMovingToDefaultPosition()
	{
        ikActive = false;
    }

    //a callback for calculating IK
    void OnAnimatorIK()
    {

        if (animator)
        {

            //if the IK is active, set the position and rotation directly to the goal. 
            if (ikActive)
            {
                // Set the look target position, if one has been assigned
                if (lookTarget != null)
                {
                    //animator.SetLookAtWeight(lookWeight);
                    animator.SetLookAtWeight(1,0.3f,0.9f);
                    animator.SetLookAtPosition(lookTarget.transform.position);
                }

            }

            //if the IK is not active, set the position and rotation of the hand and head back to the original position
            else
            {
                animator.SetLookAtWeight(0);
            }
        }
    }
}