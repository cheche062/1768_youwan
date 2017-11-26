package 
{
	/**
	 * ...
	 * @author
	 */
	import laya.display.Text;
	public class HelloLayabox{
		public function HelloLayabox(){
			
			//创建舞台
			Laya.init(600, 300);//舞台默认背景色是黑色的
			var txt:Text = new Text();
			txt.text = "Hello Layabox";
			//设置文本颜色
			txt.color = '#FF0000';
			//设置文本字体大小，单位是像素
			txt.fontSize = 66;
			//设置字体描边
			txt.stroke = 5;  //描边为5像素
			txt.strokeColor = '#FFFFFF';
			//设置为粗体
			txt.bold = false;
			//设置文本的显示起点位置X,Y
			txt.pos(60, 100);
			//设置舞台背景色
			Laya.stage.bgColor = '#23238E';
			//将文本内容添加到舞台
			Laya.stage.addChild(txt);
			
			
		}
	}

}