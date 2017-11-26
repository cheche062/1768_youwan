/**Created by the LayaAirIDE,do not modify.*/
package ui {
	import laya.ui.*;
	import laya.display.*; 

	public class roomUI extends View {

		public static var uiView:Object =/*[STATIC SAFE]*/{"type":"View","props":{"width":480,"height":852},"child":[{"type":"Image","props":{"y":0,"x":0,"skin":"war/background.png"}}]};
		override protected function createChildren():void {
			super.createChildren();
			createView(uiView);
		}
	}
}