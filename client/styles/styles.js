import { StyleSheet } from 'react-native'

export default StyleSheet.create({
  mainButtonContainer: {
    paddingVertical: 15,
    width: 150,
    backgroundColor: '#24253B',
    marginTop: 30,
    borderRadius: 3
  },

  mainButtonText: {
    textAlign: 'center',
    color: "#fff",
    fontWeight: "bold"
  },

  spacious: {
    marginTop: 20,
    marginBottom: 20
  },

  semiSpacious: {
    marginTop: 10,
    marginBottom: 10
  },

  verySpacious: {
    marginTop: 35,
    marginBottom: 35
  },

  mainButtonBox: {
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30
  },

  bottomButtonBox: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },

  mainInputField: {
    height: 50,
    color: 'rgba(0, 0, 0, 0.8)',
    paddingHorizontal: 20,
    borderColor: "#24253B",
    borderRadius: 3,
    borderWidth: 2
  },

  invalidText: {
    color: '#F54A4A'
  }
})
