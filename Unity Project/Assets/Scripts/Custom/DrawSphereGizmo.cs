using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DrawSphereGizmo : MonoBehaviour
{
    // Start is called before the first frame update
    void Start()
    {
        
    }

    // Update is called once per frame
    void Update()
    {
        
    }


    void OnDrawGizmos()
    {
        // Draw a yellow sphere at the transform's position
        Gizmos.color = Color.yellow;
        Gizmos.DrawWireSphere(this.transform.position, 0.1f);
        Gizmos.color = Color.white;
    }
}
