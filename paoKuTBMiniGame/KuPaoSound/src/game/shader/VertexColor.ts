export class VertexColor extends Laya.Material {

    constructor() {
        super();
        //设置本材质使用的shader名字
        this.setShaderName("VertexColor");
        this._shaderValues.addDefine(VertexColor.SHADERDEFINE_ENABLEVERTEXCOLOR);

    }
    //static ALBEDOCOLOR: number;
    static SHADERDEFINE_ENABLEVERTEXCOLOR: Laya.ShaderDefine;

    static hasInt=false;
    //初始化我们的自定义shader
    static initShader() {


        if (VertexColor.hasInt) return;
        VertexColor.hasInt=true;
        //注册宏定义
        VertexColor.SHADERDEFINE_ENABLEVERTEXCOLOR = Laya.Shader3D.getDefineByName("ENABLEVERTEXCOLOR");

        //所有的attributeMap属性
        var attributeMap = {
            'a_Position': Laya.VertexMesh.MESH_POSITION0,
            'a_Color': Laya.VertexMesh.MESH_COLOR0

        };

        //所有的uniform属性
        var uniformMap =
        {
            'u_MvpMatrix': Laya.Shader3D.PERIOD_SPRITE

        };

        let VS = `
            attribute vec4 a_Position;
            uniform mat4 u_MvpMatrix;
            
            #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                attribute vec4 a_Color;
                varying vec4 v_Color;
            #endif

            void main()
            {
                #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
                v_Color = a_Color;
                #endif
                gl_Position = u_MvpMatrix * a_Position;
            } `;

        let FS = `
        //不能少写这行
        #ifdef FSHIGHPRECISION
                precision highp float;
            #else
                precision mediump float;
            #endif
        
        #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
        varying vec4 v_Color;
        #endif
       
        void main()
        {
        
           #if defined(COLOR)&&defined(ENABLEVERTEXCOLOR)
              gl_FragColor=v_Color;
            #else
              gl_FragColor=vec4(1.0);
            #endif
          
        }
        `;

        //注册
        var LightSh = Laya.Shader3D.add("VertexColor");

        //创建一个SubShader
        var subShader = new Laya.SubShader(attributeMap, uniformMap);

        //我们的自定义shader customShader中添加我们新创建的subShader
        LightSh.addSubShader(subShader);

        //往新创建的subShader中添加shaderPass
        subShader.addShaderPass(VS, FS);


    }


}