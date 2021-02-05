using System.Collections;
using System.Collections.Generic;
using UnityEngine;

public class DrawSphereGizmo2 : MonoBehaviour
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
        Gizmos.color = Color.red;
        Gizmos.DrawWireSphere(this.transform.position, 0.05f);
        Gizmos.color = Color.white;
    }
}
