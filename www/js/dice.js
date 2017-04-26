/*
 * What is a game of Catan without a dice?
 */
 
function dice(element) {
    var m_element = element;
    var m_this = this;
    m_this.value = 1;
    m_this.juggling = false;
    m_this.juggleinterval = 25;
    
    this.glyphSize = 150;
    
    this._set_face = function(value) {
        var xpos, ypos;
        switch (value)
        {
          default:
          case 1: xpos =                  0; ypos =  0;               break;
          case 2: xpos = 2*m_this.glyphSize; ypos =  0;               break;
          case 3: xpos =   m_this.glyphSize; ypos =  0;               break;
          case 4: xpos =   m_this.glyphSize; ypos = m_this.glyphSize; break;
          case 5: xpos = 2*m_this.glyphSize; ypos = m_this.glyphSize; break;
          case 6: xpos =                  0; ypos = m_this.glyphSize; break;
        }
        m_element.css('backgroundPosition', xpos+'px '+ypos+'px');
        m_this.value = value;
    };
    
    this.juggle = function() {
        if(m_this.juggling) {
            m_this._set_face(m_this.value);
            window.setTimeout(m_this.juggle, m_this.juggleinterval);
            m_this.value = (m_this.value % 6) + 1;
        }
    };
    
    this.start_juggle = function() {
        m_this.juggling = true;
        m_this.juggle();
    };
    
    this.set_face = function(value) {
        m_this.juggling = false;
        m_this._set_face(value);
    };
}
