package 
{
	/**
	 * ...
	 * @author
	 */
	public class Main{
		public function Main(){
			
			//创建舞台
			Laya.init(480, 852);//舞台默认背景色是黑色的

			var bg:BackGround = new BackGround();
			Laya.stage.addChild(bg);

			
		}
	}

}