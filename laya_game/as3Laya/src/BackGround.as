package 
{
	import laya.display.Sprite;
	
	/**
	 * ...
	 * @author ...
	 */
	public class BackGround extends Sprite 
	{
		private var bg1: Sprite;
		private var bg2: Sprite;

		public function BackGround()
		{
			this.init();

			Laya.timer.frameLoop(1, this, this.onloop);
		}

		private function init():void{
			
			bg1 = new Sprite();
			bg1.loadImage("war/background.png");
			this.addChild(bg1);
			
			bg2 = new Sprite();
			bg2.loadImage("war/background.png");
			bg2.pos(0, -852);
			this.addChild(bg2);
			
		}

		private function onloop():void{
			this.y +=1;
			if(this.y >= 852){
				this.y = 0;
			}
		}
		
	}

}